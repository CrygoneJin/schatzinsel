// === AR-MODUS — Insel auf dem Tisch via WebXR (#24) ===
// Raw WebGL + WebXR, kein Framework. Flat-shaded Quads, Farben aus materials.js.

(function () {
    'use strict';

    // --- State ---
    let xrSession = null;
    let xrRefSpace = null;
    let xrHitTestSource = null;
    let gl = null;
    let glProgram = null;
    let positionBuffer = null;
    let colorBuffer = null;
    let anchorPlaced = false;
    let anchorMatrix = null; // 4x4 placement transform
    let vertexCount = 0;

    // --- WebXR Support Check ---
    function isWebXRSupported() {
        return !!(navigator.xr && navigator.xr.isSessionSupported);
    }

    // --- Show/Hide AR Button ---
    function initARButton() {
        const btn = document.getElementById('ar-btn');
        if (!btn) return;

        if (!isWebXRSupported()) {
            btn.style.display = 'none';
            return;
        }

        // Check actual immersive-ar support
        navigator.xr.isSessionSupported('immersive-ar').then(function (supported) {
            btn.style.display = supported ? '' : 'none';
        }).catch(function () {
            btn.style.display = 'none';
        });

        btn.addEventListener('click', startAR);
    }

    // --- Toast (fallback wenn kein WebXR) ---
    function showARToast(msg) {
        if (window.showToast) {
            window.showToast(msg);
        } else {
            alert(msg);
        }
    }

    // --- Hex to RGB [0..1] ---
    function hexToRGB(hex) {
        if (!hex || !hex.startsWith('#')) return [0.5, 0.5, 0.5];
        const num = parseInt(hex.slice(1), 16);
        return [
            ((num >> 16) & 255) / 255,
            ((num >> 8) & 255) / 255,
            (num & 255) / 255
        ];
    }

    // --- Build grid mesh (flat quads on XZ plane) ---
    function buildGridMesh() {
        const grid = window.grid;
        const dims = window.INSEL_DIMS;
        const MATERIALS = window.INSEL_MATERIALS;
        if (!grid || !dims || !MATERIALS) return { positions: [], colors: [], count: 0 };

        const ROWS = dims.ROWS;
        const COLS = dims.COLS;
        const CELL = 0.02; // 2cm per cell in AR world units (meters)
        const offsetX = -(COLS * CELL) / 2;
        const offsetZ = -(ROWS * CELL) / 2;

        const positions = [];
        const colors = [];

        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                const x0 = offsetX + c * CELL;
                const x1 = x0 + CELL;
                const z0 = offsetZ + r * CELL;
                const z1 = z0 + CELL;
                const y = 0; // flat on surface

                // Determine color
                let rgb;
                const matId = grid[r] && grid[r][c];
                if (matId && MATERIALS[matId]) {
                    rgb = hexToRGB(MATERIALS[matId].color);
                } else {
                    // Empty cell = sand
                    rgb = [0.96, 0.87, 0.70]; // #F5DEB3
                }

                // Two triangles per quad (CCW winding)
                // Triangle 1: (x0,y,z0), (x1,y,z0), (x1,y,z1)
                positions.push(x0, y, z0, x1, y, z0, x1, y, z1);
                // Triangle 2: (x0,y,z0), (x1,y,z1), (x0,y,z1)
                positions.push(x0, y, z0, x1, y, z1, x0, y, z1);

                // 6 vertices, same color
                for (let v = 0; v < 6; v++) {
                    colors.push(rgb[0], rgb[1], rgb[2]);
                }

                // If material present, add a raised block (height = CELL * 0.5)
                if (matId && MATERIALS[matId]) {
                    const h = CELL * 0.5;

                    // Top face (y = h)
                    positions.push(x0, h, z0, x1, h, z0, x1, h, z1);
                    positions.push(x0, h, z0, x1, h, z1, x0, h, z1);
                    for (let v = 0; v < 6; v++) colors.push(rgb[0], rgb[1], rgb[2]);

                    // Front face (z1 side)
                    const darkRgb = [rgb[0] * 0.7, rgb[1] * 0.7, rgb[2] * 0.7];
                    positions.push(x0, 0, z1, x1, 0, z1, x1, h, z1);
                    positions.push(x0, 0, z1, x1, h, z1, x0, h, z1);
                    for (let v = 0; v < 6; v++) colors.push(darkRgb[0], darkRgb[1], darkRgb[2]);

                    // Right face (x1 side)
                    const sideRgb = [rgb[0] * 0.55, rgb[1] * 0.55, rgb[2] * 0.55];
                    positions.push(x1, 0, z0, x1, 0, z1, x1, h, z1);
                    positions.push(x1, 0, z0, x1, h, z1, x1, h, z0);
                    for (let v = 0; v < 6; v++) colors.push(sideRgb[0], sideRgb[1], sideRgb[2]);
                }
            }
        }

        return {
            positions: new Float32Array(positions),
            colors: new Float32Array(colors),
            count: positions.length / 3
        };
    }

    // --- WebGL Shader Setup ---
    const VERT_SRC = `
        attribute vec3 aPosition;
        attribute vec3 aColor;
        uniform mat4 uProjection;
        uniform mat4 uView;
        uniform mat4 uModel;
        varying vec3 vColor;
        void main() {
            vColor = aColor;
            gl_Position = uProjection * uView * uModel * vec4(aPosition, 1.0);
        }
    `;

    const FRAG_SRC = `
        precision mediump float;
        varying vec3 vColor;
        void main() {
            gl_FragColor = vec4(vColor, 1.0);
        }
    `;

    function compileShader(gl, src, type) {
        const s = gl.createShader(type);
        gl.shaderSource(s, src);
        gl.compileShader(s);
        if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
            console.error('AR shader error:', gl.getShaderInfoLog(s));
            gl.deleteShader(s);
            return null;
        }
        return s;
    }

    function initGL(glCtx) {
        gl = glCtx;
        const vs = compileShader(gl, VERT_SRC, gl.VERTEX_SHADER);
        const fs = compileShader(gl, FRAG_SRC, gl.FRAGMENT_SHADER);
        if (!vs || !fs) return false;

        glProgram = gl.createProgram();
        gl.attachShader(glProgram, vs);
        gl.attachShader(glProgram, fs);
        gl.linkProgram(glProgram);

        if (!gl.getProgramParameter(glProgram, gl.LINK_STATUS)) {
            console.error('AR program link error:', gl.getProgramInfoLog(glProgram));
            return false;
        }

        positionBuffer = gl.createBuffer();
        colorBuffer = gl.createBuffer();
        return true;
    }

    function uploadMesh() {
        const mesh = buildGridMesh();
        vertexCount = mesh.count;
        if (vertexCount === 0) return;

        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, mesh.positions, gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, mesh.colors, gl.STATIC_DRAW);
    }

    // --- Reticle (placement indicator) ---
    let reticleBuffer = null;
    let reticleVisible = false;
    let reticleMatrix = new Float32Array(16);

    function initReticle() {
        // Simple circle as line segments
        const segs = 32;
        const r = 0.05; // 5cm radius
        const verts = [];
        for (let i = 0; i <= segs; i++) {
            const a = (i / segs) * Math.PI * 2;
            verts.push(Math.cos(a) * r, 0, Math.sin(a) * r);
        }
        reticleBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, reticleBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
    }

    // --- Start AR Session ---
    async function startAR() {
        if (!isWebXRSupported()) {
            showARToast('AR nicht unterstützt auf diesem Gerät');
            return;
        }

        try {
            const supported = await navigator.xr.isSessionSupported('immersive-ar');
            if (!supported) {
                showARToast('AR nicht unterstützt auf diesem Gerät');
                return;
            }
        } catch (e) {
            showARToast('AR nicht unterstützt auf diesem Gerät');
            return;
        }

        try {
            xrSession = await navigator.xr.requestSession('immersive-ar', {
                requiredFeatures: ['hit-test', 'local-floor']
            });
        } catch (e) {
            // Fallback without local-floor
            try {
                xrSession = await navigator.xr.requestSession('immersive-ar', {
                    requiredFeatures: ['hit-test']
                });
            } catch (e2) {
                showARToast('AR-Session konnte nicht gestartet werden');
                return;
            }
        }

        anchorPlaced = false;
        anchorMatrix = null;

        // Create WebGL canvas for XR
        const canvas = document.createElement('canvas');
        const glCtx = canvas.getContext('webgl', { xrCompatible: true });
        if (!glCtx) {
            showARToast('WebGL nicht verfügbar');
            xrSession.end();
            return;
        }

        if (!initGL(glCtx)) {
            showARToast('WebGL-Initialisierung fehlgeschlagen');
            xrSession.end();
            return;
        }

        initReticle();
        uploadMesh();

        // Bind XR session to GL context
        await glCtx.makeXRCompatible();
        const baseLayer = new XRWebGLLayer(xrSession, gl);
        xrSession.updateRenderState({ baseLayer: baseLayer });

        // Reference space
        try {
            xrRefSpace = await xrSession.requestReferenceSpace('local-floor');
        } catch (e) {
            xrRefSpace = await xrSession.requestReferenceSpace('local');
        }

        // Hit-test source (from viewer)
        const viewerSpace = await xrSession.requestReferenceSpace('viewer');
        xrHitTestSource = await xrSession.requestHitTestSource({ space: viewerSpace });

        // Select = place island
        xrSession.addEventListener('select', onSelect);
        xrSession.addEventListener('end', onSessionEnd);

        // Start render loop
        xrSession.requestAnimationFrame(onXRFrame);
    }

    function onSelect() {
        if (!anchorPlaced && reticleVisible) {
            anchorPlaced = true;
            anchorMatrix = new Float32Array(reticleMatrix);
        }
    }

    function onSessionEnd() {
        xrSession = null;
        xrRefSpace = null;
        xrHitTestSource = null;
        anchorPlaced = false;
        anchorMatrix = null;
        gl = null;
        glProgram = null;
    }

    // --- XR Render Loop ---
    function onXRFrame(time, frame) {
        if (!xrSession) return;
        xrSession.requestAnimationFrame(onXRFrame);

        const pose = frame.getViewerPose(xrRefSpace);
        if (!pose) return;

        const glLayer = xrSession.renderState.baseLayer;
        gl.bindFramebuffer(gl.FRAMEBUFFER, glLayer.framebuffer);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.enable(gl.DEPTH_TEST);

        // Hit-test for reticle
        if (xrHitTestSource && !anchorPlaced) {
            const hitResults = frame.getHitTestResults(xrHitTestSource);
            if (hitResults.length > 0) {
                const hitPose = hitResults[0].getPose(xrRefSpace);
                if (hitPose) {
                    reticleVisible = true;
                    reticleMatrix.set(hitPose.transform.matrix);
                }
            } else {
                reticleVisible = false;
            }
        }

        for (const view of pose.views) {
            const vp = glLayer.getViewport(view);
            gl.viewport(vp.x, vp.y, vp.width, vp.height);

            const projMatrix = view.projectionMatrix;
            const viewMatrix = view.transform.inverse.matrix;

            gl.useProgram(glProgram);

            const uProjection = gl.getUniformLocation(glProgram, 'uProjection');
            const uView = gl.getUniformLocation(glProgram, 'uView');
            const uModel = gl.getUniformLocation(glProgram, 'uModel');

            gl.uniformMatrix4fv(uProjection, false, projMatrix);
            gl.uniformMatrix4fv(uView, false, viewMatrix);

            // Draw reticle (before placement)
            if (!anchorPlaced && reticleVisible) {
                gl.uniformMatrix4fv(uModel, false, reticleMatrix);

                const aPos = gl.getAttribLocation(glProgram, 'aPosition');
                const aCol = gl.getAttribLocation(glProgram, 'aColor');

                gl.bindBuffer(gl.ARRAY_BUFFER, reticleBuffer);
                gl.enableVertexAttribArray(aPos);
                gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 0, 0);

                // Reticle color = white
                gl.disableVertexAttribArray(aCol);
                gl.vertexAttrib3f(aCol, 1.0, 1.0, 1.0);

                gl.drawArrays(gl.LINE_STRIP, 0, 33); // 32 segments + close
            }

            // Draw island (after placement)
            if (anchorPlaced && anchorMatrix && vertexCount > 0) {
                // Refresh mesh periodically (grid may change)
                if (Math.floor(time / 2000) !== Math.floor((time - 16) / 2000)) {
                    uploadMesh();
                }

                gl.uniformMatrix4fv(uModel, false, anchorMatrix);

                const aPos = gl.getAttribLocation(glProgram, 'aPosition');
                const aCol = gl.getAttribLocation(glProgram, 'aColor');

                gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
                gl.enableVertexAttribArray(aPos);
                gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 0, 0);

                gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
                gl.enableVertexAttribArray(aCol);
                gl.vertexAttribPointer(aCol, 3, gl.FLOAT, false, 0, 0);

                gl.drawArrays(gl.TRIANGLES, 0, vertexCount);
            }
        }
    }

    // --- Init on DOMContentLoaded ---
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initARButton);
    } else {
        initARButton();
    }

    // Expose for testing
    window.INSEL_AR = {
        startAR: startAR,
        isSupported: isWebXRSupported
    };

})();
