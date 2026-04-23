# Standardmodell komplett — alle 17 Teilchen gemappt

Datum: 2026-04-22
Branch: `feat/standardmodell-komplett`
Commits: materials + automerge + tests + docs

## Motiv

Oscar (8) soll morgen früh sagen können: „ich kenne alle Teilchen".
Nach S99/S100/S101 fehlten noch: Higgs als spawnbares Material,
Mesonen (Pion/Kaon) und das Positron als eigenes Anti-Teilchen.

## Mapping: Standardmodell → Schatzinsel

### Fermionen (Materie, spin 1/2)

| Standardmodell        | Schatzinsel-Material | Emoji | Art     |
|-----------------------|----------------------|-------|---------|
| Up-Quark (Gen 1)      | `yang`               | ⚪    | Material |
| Down-Quark (Gen 1)    | `yin`                | ⚫    | Material |
| Charm-Quark (Gen 2)   | `charm`              | 💫    | Material |
| Strange-Quark (Gen 2) | `strange`            | 🌀    | Material |
| Top-Quark (Gen 3)     | `mountain` (Berg)    | 🏔️    | Material |
| Bottom-Quark (Gen 3)  | `cave` (Höhle)       | 🕳️    | Material |
| Elektron (Gen 1)      | `electron`           | 🔹    | Material |
| Myon (Gen 2)          | `muon`               | 🔸    | Material |
| Tau (Gen 3)           | `tau`                | 🔻    | Material |
| e-Neutrino            | `neutrino`           | 👻    | Material |
| μ-Neutrino            | `neutrino_mu`        | 👻    | Material |
| τ-Neutrino            | `neutrino_tau`       | 👻    | Material |

### Bosonen (Kraftteilchen)

| Standardmodell        | Schatzinsel-Material | Emoji | spin | Bemerkung |
|-----------------------|----------------------|-------|------|-----------|
| Photon (γ)            | `photon`             | 💛    | 1    | Masselos |
| W-Boson               | `w_boson`            | 🔀    | 1    | 80 GeV |
| Z-Boson               | `z_boson`            | ⚖️    | 1    | 91 GeV |
| Gluon                 | `qi` (Qi)            | ✨    | 1    | Doppel-Name Dao+Physik |
| Higgs-Boson (neu)     | `higgs_boson`        | 🫧    | 0    | 125 GeV |
| Graviton (hypothet.)  | — (das Grid selbst)  | —     | —    | Raumzeit, kein Material |

### Zusammengesetzte Teilchen (Composites)

| Standardmodell        | Schatzinsel           | Weg          |
|-----------------------|----------------------|--------------|
| Proton (uud)          | `proton` 🔴           | Triplet-Merge |
| Neutron (udd)         | `neutron` ⭕          | Triplet-Merge |
| Pion (neu)            | `pion` 🎯             | Pair-Merge |
| Kaon (neu)            | `kaon` 🪩             | Pair-Merge |
| Positron (neu)        | `positron` 🟠         | Pair-Merge |
| Antimaterie (generisch)| `antimatter` ⚛️      | Pair-Merge |

### Atome (Cluster-Recognizer, nicht via Merge)

| Atom          | Schatzinsel-Cluster           |
|---------------|-------------------------------|
| Wasserstoff H | 1 proton + 1 electron         |
| H⁺ (Ion)      | 1 proton                      |
| Helium-3      | 2 proton + 1 neutron + 2 electron |
| Helium-4      | 2 proton + 2 neutron + 2 electron |

## 17 Teilchen-Check

Das Standardmodell zählt klassisch 17 Elementarteilchen:
- 6 Quarks (up/down/charm/strange/top/bottom) → alle gemappt
- 6 Leptonen (e/μ/τ + 3 Neutrinos) → alle gemappt
- 4 Gauge-Bosonen (γ/W/Z/Gluon) → alle gemappt
- 1 Higgs-Boson → jetzt gemappt (neu in diesem PR)

Anti-Teilchen existieren als generisches `antimatter` + `positron` (neu).
Mesonen (`pion`, `kaon`) sind Composites, kein Teil der 17 — Bonus für Oscar.

## Neue Merge-Regeln

```
mountain + cave        → higgs_boson  (Top+Bottom-Fusion, 125 GeV)
yang + electron        → pion         (leichtestes Meson)
strange + electron     → kaon         (seltsames Meson)
antimatter + electron  → positron     (Dirac 1928)
```

## Scientist-Gate (Kollisions-Check)

Muster aus PR #434 angewandt. Alle vier neuen Regeln kollisionsfrei:

- `mountain×mountain` und `cave×cave` haben keine Pair-Regel → Higgs nicht überschrieben
- `yang+electron` und `strange+electron` waren vorher frei
- `antimatter+electron` war vorher frei (nur `antimatter+yang → electron` existiert)
- `electron+yin → neutrino` steht weiterhin WEITER UNTEN und bleibt unverändert
- Baryon-Triplet (TRIPLET_RULES) läuft VOR Pair-Merges → Proton/Neutron unberührt

Rule-Order-Hinweis: Wenn Oscar Yang+Electron+Yin zusammen setzt, greift die
erste passende Pair-Rule. Pion (yang+electron) steht vor Neutrino (electron+yin),
also gewinnt Pion in dieser Konfiguration. Beabsichtigt: Meson als
Zwischenschritt zur Atom-Bildung erhöht Oscars Entdeckungspfad.

## Tests

- 23 automerge-Tests grün (10 bestehend + 13 neu)
- 44 verwandte Tests grün (atom-recognizer, mass-map, unit)
- `tsc --noEmit` grün (Material-Interface um `spin?` erweitert)

---

## Nachtrag 2026-04-22 — Baryon-Bauplan-Audit (Till)

Till hat vier Probleme im Baryon-Bauplan gefunden. Alle vier in
`fix/baryon-bauplan` gefixt.

### 1. Neutron-Masse leicht größer als Proton

Real: Proton 938.272 MeV/c², Neutron 939.565 MeV/c² (Neutron ~0.14%
schwerer, wegen schwererem down-Quark + EM-Selbstenergie). Im Spiel
waren beide bei `mass: 20`. Jetzt: Neutron `mass: 21` (+5%). Effekt
auf Curvature-Map minimal, Ordnung stimmt.

### 2. Farbladung — ehrlich dokumentiert (nicht modelliert)

Bisheriger Kommentar `"Farbneutral via drei verschiedene Farbladungen"`
war irreführend: Yang und Yin haben im Spiel keine Farb-Varianten.
Wir modellieren die Dreiheit nur über Flavor (uud/udd).

Entscheidung: **Abstraktion beibehalten, Kommentar ehrlich machen**.
Eine Mechanik mit drei Farb-Yangs/-Yins würde die Quark-Ladder
(Yang² → Charm) komplett umbauen — aus Spielbarkeits-Gründen
ausgespart. Dokumentiert in `automerge.js` (TRIPLET_RULES-Block) und
`materials.js` (Proton/Neutron-Definition).

### 3. Spin-Feld für alle Fermionen

Bisher hatten nur Bosonen (γ, W, Z, H) und Mesonen/Positron spin-Felder.
Baryonen (Proton, Neutron) und alle Quarks/Leptonen fehlten. Alle
Fermionen haben jetzt `spin: 0.5`:

- Gen-1-Quarks: yin, yang
- Gen-2-Quarks: charm, strange
- Gen-3-Quarks: mountain (top), cave (bottom)
- Leptonen: electron, muon, tau
- Neutrinos: neutrino, neutrino_mu, neutrino_tau
- Baryonen: proton, neutron

### 4. Pauli verhindert Baryon-Bildung — Craft-Rezept als Fix

Grid-Triplet-Merge (Yang+Yang+Yin → Proton) wird durch den Pair-Merge
Yang+Yang → Charm blockiert: sobald der zweite Yang auf einer Kante
landet, ist Charm da, bevor Yin gelegt werden kann. Oscar kommt nicht
zum Ziel.

Fix: Baryon als Craft-Recipe.
```
2 Yang + 1 Yin → 1 Proton   (uud, Ladung +1)
1 Yang + 2 Yin → 1 Neutron  (udd, Ladung  0)
```

Grid-Triplet bleibt als emergent bonus für Physik-Nerds (diagonale
Platzierung).

### Tests

Neue Suite "Baryon-Bauplan-Konsistenz" + "INSEL_CRAFTING_RECIPES —
Baryon-Craft" in `ops/tests/automerge.test.js`. `package.json`
erweitert: automerge.test.js ist jetzt Teil von `npm run test:unit`
(war vorher nicht eingehängt).

72 Tests grün nach den Fixes. `tsc --noEmit` grün.
