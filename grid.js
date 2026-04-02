// @ts-check
// grid.js — Grid-Initialisierung und Insel-Generierung (Zellteilung #11)
// Exportiert: window.INSEL_GRID
(function () {
    'use strict';

    /**
     * Leeres Grid initialisieren.
     * @param {number} rows
     * @param {number} cols
     * @returns {Array<Array<string|null>>}
     */
    function initGrid(rows, cols) {
        var grid = [];
        for (var r = 0; r < rows; r++) {
            grid[r] = [];
            for (var c = 0; c < cols; c++) {
                grid[r][c] = null;
            }
        }
        return grid;
    }

    /**
     * Prozedural generierte Starter-Insel: Strand, Palmen, Fluss, Berg, Weg.
     * @param {Array<Array<string|null>>} grid
     * @param {number} rows
     * @param {number} cols
     * @param {Object} materials
     */
    function generateStarterIsland(grid, rows, cols, materials) {
        var seed = Date.now();
        function rng() { seed = (seed * 16807 + 0) % 2147483647; return seed / 2147483647; }

        var WE = 2;
        var cx = cols / 2, cy = rows / 2;
        var rx = (cols - WE * 2) * 0.48, ry = (rows - WE * 2) * 0.48;

        // Strandrand
        for (var r = WE; r < rows - WE; r++) {
            for (var c = WE; c < cols - WE; c++) {
                var dx = (c - cx) / rx, dy = (r - cy) / ry;
                var dist = dx * dx + dy * dy;
                var wobble = 0.15 * Math.sin(r * 1.7 + c * 0.9) + 0.1 * Math.cos(c * 2.3 - r * 0.7);
                if (dist < (0.7 + wobble) && dist >= (0.5 + wobble)) {
                    grid[r][c] = 'sand';
                }
            }
        }

        // Palmen am Strand
        var palmCount = Math.max(6, Math.floor((rows + cols) * 0.3));
        var palmsPlaced = 0;
        for (var attempt = 0; attempt < 200 && palmsPlaced < palmCount; attempt++) {
            var pr = Math.floor(rng() * rows), pc = Math.floor(rng() * cols);
            if (grid[pr][pc] === 'sand') { grid[pr][pc] = 'palm'; palmsPlaced++; }
        }

        // Bäume im Inneren
        var treeCount = Math.max(4, Math.floor((rows + cols) * 0.2));
        var treesPlaced = 0;
        for (attempt = 0; attempt < 200 && treesPlaced < treeCount; attempt++) {
            var tr = Math.floor(rng() * rows), tc = Math.floor(rng() * cols);
            var tdx = (tc - cx) / rx, tdy = (tr - cy) / ry;
            if (tdx * tdx + tdy * tdy < 0.4 && !grid[tr][tc]) {
                grid[tr][tc] = rng() < 0.5 ? 'tree' : 'small_tree';
                treesPlaced++;
            }
        }

        // Blumen und Pflanzen
        var floraCount = Math.max(3, Math.floor((rows + cols) * 0.15));
        var floraPlaced = 0;
        for (attempt = 0; attempt < 200 && floraPlaced < floraCount; attempt++) {
            var fr = Math.floor(rng() * rows), fc = Math.floor(rng() * cols);
            var fdx = (fc - cx) / rx, fdy = (fr - cy) / ry;
            if (fdx * fdx + fdy * fdy < 0.45 && !grid[fr][fc]) {
                grid[fr][fc] = rng() < 0.6 ? 'flower' : 'plant';
                floraPlaced++;
            }
        }

        // Fluss
        var riverStartC = Math.floor(cx + (rng() - 0.5) * 4);
        var rc = riverStartC;
        for (var rr = Math.floor(cy - ry * 0.6); rr < Math.floor(cy + ry * 0.6); rr++) {
            if (rr >= 0 && rr < rows && rc >= 0 && rc < cols) {
                var rdx = (rc - cx) / rx, rdy = (rr - cy) / ry;
                if (rdx * rdx + rdy * rdy < 0.5) {
                    grid[rr][rc] = 'water';
                    if (rng() < 0.4 && rc + 1 < cols) grid[rr][rc + 1] = 'water';
                }
            }
            rc += rng() < 0.3 ? -1 : rng() > 0.7 ? 1 : 0;
            rc = Math.max(2, Math.min(cols - 3, rc));
        }

        // Steine
        var stoneCount = Math.max(3, Math.floor((rows + cols) * 0.08));
        var stonesPlaced = 0;
        var stoneCy = cy - ry * 0.3;
        for (attempt = 0; attempt < 200 && stonesPlaced < stoneCount; attempt++) {
            var sr = Math.floor(stoneCy + (rng() - 0.5) * ry * 0.4);
            var sc = Math.floor(cx + (rng() - 0.5) * rx * 0.5);
            if (sr >= 0 && sr < rows && sc >= 0 && sc < cols && !grid[sr][sc]) {
                var sdx = (sc - cx) / rx, sdy = (sr - cy) / ry;
                if (sdx * sdx + sdy * sdy < 0.35) { grid[sr][sc] = 'stone'; stonesPlaced++; }
            }
        }

        // Berge
        if (materials['mountain']) {
            var mountainCount = rng() < 0.5 ? 1 : 2;
            var mountainsPlaced = 0;
            for (attempt = 0; attempt < 100 && mountainsPlaced < mountainCount; attempt++) {
                var mr = Math.floor(cy - ry * 0.2 + rng() * ry * 0.3);
                var mc = Math.floor(cx + (rng() - 0.5) * rx * 0.4);
                if (mr >= 0 && mr < rows && mc >= 0 && mc < cols && !grid[mr][mc]) {
                    grid[mr][mc] = 'mountain'; mountainsPlaced++;
                }
            }
        }

        // Dichter Wald im Zentrum
        var extraTrees = Math.max(4, Math.floor((rows + cols) * 0.15));
        var extraPlaced = 0;
        for (attempt = 0; attempt < 300 && extraPlaced < extraTrees; attempt++) {
            var er = Math.floor(rng() * rows), ec = Math.floor(rng() * cols);
            var edx = (ec - cx) / rx, edy = (er - cy) / ry;
            if (edx * edx + edy * edy < 0.3 && !grid[er][ec]) {
                grid[er][ec] = rng() < 0.3 ? 'tree' : rng() < 0.6 ? 'small_tree' : 'plant';
                extraPlaced++;
            }
        }

        // Weg vom Strand zum Zentrum
        var pathStartR = Math.floor(cy + ry * 0.6);
        for (var pathR = pathStartR; pathR > Math.floor(cy); pathR--) {
            var pathC = Math.floor(cx + Math.sin(pathR * 0.3) * 2);
            if (pathR >= 0 && pathR < rows && pathC >= 0 && pathC < cols) {
                if (!grid[pathR][pathC] || grid[pathR][pathC] === 'sand') {
                    grid[pathR][pathC] = 'path';
                }
            }
        }
    }

    /**
     * Lummerland — handgebaute Tutorial-Insel (Michael Ende).
     * "Lummerland war nur eine kleine Insel mit zwei Bergen."
     * @param {Array<Array<string|null>>} grid
     * @param {number} rows
     * @param {number} cols
     * @param {Object} materials
     */
    function generateLummerland(grid, rows, cols, materials) {
        var cx = Math.floor(cols / 2), cy = Math.floor(rows / 2);
        var rx = Math.floor(cols * 0.38), ry = Math.floor(rows * 0.38);

        // Ovaler Strand
        for (var r = 0; r < rows; r++) {
            for (var c = 0; c < cols; c++) {
                var dx = (c - cx) / rx, dy = (r - cy) / ry;
                var dist = dx * dx + dy * dy;
                if (dist < 0.7 && dist >= 0.55) grid[r][c] = 'sand';
            }
        }

        // Zwei Berge
        var berg1r = cy - Math.floor(ry * 0.3), berg1c = cx - Math.floor(rx * 0.2);
        var berg2r = cy - Math.floor(ry * 0.2), berg2c = cx + Math.floor(rx * 0.25);
        if (materials['mountain']) {
            if (grid[berg1r]) grid[berg1r][berg1c] = 'mountain';
            if (grid[berg2r]) grid[berg2r][berg2c] = 'mountain';
            var berge = [[berg1r, berg1c], [berg2r, berg2c]];
            var neighbors = [[0,1],[0,-1],[1,0],[-1,0]];
            for (var bi = 0; bi < berge.length; bi++) {
                var br = berge[bi][0], bc = berge[bi][1];
                for (var ni = 0; ni < neighbors.length; ni++) {
                    var nr = br + neighbors[ni][0], nc = bc + neighbors[ni][1];
                    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !grid[nr][nc]) {
                        grid[nr][nc] = 'stone';
                    }
                }
            }
        }

        // Lokomotiv-Schuppen
        var schuppenR = cy + Math.floor(ry * 0.1), schuppenC = cx - Math.floor(rx * 0.1);
        var schuppen = [[-1,-1,'wood'],[-1,0,'wood'],[-1,1,'wood'],[0,-1,'wood'],[0,0,'door'],[0,1,'wood'],[-2,-1,'roof'],[-2,0,'roof'],[-2,1,'roof']];
        for (var si = 0; si < schuppen.length; si++) {
            var sdr = schuppen[si][0], sdc = schuppen[si][1], smat = schuppen[si][2];
            var sr2 = schuppenR + sdr, sc2 = schuppenC + sdc;
            if (sr2 >= 0 && sr2 < rows && sc2 >= 0 && sc2 < cols && materials[smat]) grid[sr2][sc2] = smat;
        }

        // Frau Waas' Laden
        var ladenR = cy, ladenC = cx + Math.floor(rx * 0.15);
        var laden = [[-1,-1,'stone'],[-1,0,'glass'],[-1,1,'stone'],[0,-1,'stone'],[0,0,'door'],[0,1,'stone'],[-2,-1,'roof'],[-2,0,'lamp'],[-2,1,'roof']];
        for (var li = 0; li < laden.length; li++) {
            var ldr = laden[li][0], ldc = laden[li][1], lmat = laden[li][2];
            var lr = ladenR + ldr, lc2 = ladenC + ldc;
            if (lr >= 0 && lr < rows && lc2 >= 0 && lc2 < cols && materials[lmat]) grid[lr][lc2] = lmat;
        }

        // Schienen
        for (var sc3 = schuppenC + 2; sc3 < cx + Math.floor(rx * 0.4); sc3++) {
            if (sc3 >= 0 && sc3 < cols && schuppenR >= 0 && schuppenR < rows) {
                if (!grid[schuppenR][sc3]) grid[schuppenR][sc3] = 'path';
            }
        }

        // Bäume und Palmen
        var spots = [
            [cy - Math.floor(ry*0.1), cx - Math.floor(rx*0.35), 'palm'],
            [cy + Math.floor(ry*0.3), cx - Math.floor(rx*0.15), 'palm'],
            [cy + Math.floor(ry*0.35), cx + Math.floor(rx*0.1), 'palm'],
            [cy + Math.floor(ry*0.2), cx + Math.floor(rx*0.3), 'palm'],
            [cy - Math.floor(ry*0.15), cx + Math.floor(rx*0.35), 'tree'],
            [cy + Math.floor(ry*0.05), cx - Math.floor(rx*0.3), 'tree'],
            [cy - Math.floor(ry*0.35), cx, 'tree'],
            [cy + Math.floor(ry*0.1), cx + Math.floor(rx*0.05), 'flower'],
            [cy + Math.floor(ry*0.15), cx - Math.floor(rx*0.05), 'flower'],
            [cy + Math.floor(ry*0.25), cx, 'plant'],
        ];
        for (var spi = 0; spi < spots.length; spi++) {
            var spr = spots[spi][0], spc = spots[spi][1], spmat = spots[spi][2];
            if (spr >= 0 && spr < rows && spc >= 0 && spc < cols && !grid[spr][spc]) {
                grid[spr][spc] = spmat;
            }
        }

        // Kleiner Hafen
        var hafenR = cy + Math.floor(ry * 0.45), hafenC = cx;
        for (var hdc = -1; hdc <= 1; hdc++) {
            var hc = hafenC + hdc;
            if (hafenR >= 0 && hafenR < rows && hc >= 0 && hc < cols) grid[hafenR][hc] = 'water';
            if (hafenR + 1 < rows && hc >= 0 && hc < cols) grid[hafenR + 1][hc] = 'water';
        }
        if (materials['boat'] && hafenR >= 0 && hafenR < rows && hafenC >= 0 && hafenC < cols) {
            grid[hafenR][hafenC] = 'boat';
        }
    }

    window.INSEL_GRID = {
        initGrid: initGrid,
        generateStarterIsland: generateStarterIsland,
        generateLummerland: generateLummerland,
    };
})();
