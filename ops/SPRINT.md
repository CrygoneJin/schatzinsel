# Sprint 124 — "Floriane hört ins Unsichtbare, Bernd steht früh auf, Tommy macht Strom"

**Sprint Goal (Oscar-Perspektive):**
> Oscar findet 10 neue Quests — Floriane entdeckt Töne die der Körper fühlt obwohl das Ohr sie nicht hört, legt zum ersten Mal die Noten weg, und erkennt Oscars Stimme als einzigartig; Bernd beobachtet Zugvögel bis alle weg sind, steht jeden Morgen um 5:30 auf wegen Tau, und findet einen Fels der sieben Zeitalter trägt; Tommy lässt Wasser klettern, Kreisel stehen, Magnete Strom machen und zeigt das ganze Wetter in einem Glastank. 1075→**1085 Quests**.

**Start:** 2026-05-05
**Sprint-Prinzip:** Quest-Track autonom. Ein Branch pro Sprint — kein Phantom-Spawning.

---

## Sprint Backlog S124

| # | Item | Owner(s) | Status |
|---|------|----------|--------|
| S124-1 | **Quest-Runde 106** — Floriane(80→83 +3)/Bernd(80→83 +3)/Tommy(81→85 +4) → +10 Quests, 1075→1085. Floriane: „Infraschall, Stimmabdruck, Improvisation". Bernd: „Vogelzug, Tau, Gestein". Tommy: „Kapillar, Kreisel, Induktion, Konvektion". | Artist | ✅ feat/sprint-124 |

---

## Ceremony-Status S124

- [x] Planning: 2026-05-05 (autonomer Agent)
- [x] Daily Scrum: 2026-05-05 (autonomer Agent)
- [x] Review: 2026-05-05 (autonomer Agent)
- [x] Retro: 2026-05-05 (autonomer Agent)

---

## Daily Scrum S124 (2026-05-05, autonomer Agent)

**Was wurde heute gemacht?**
- S124 Planning: floriane(80→83 +3) / bernd(80→83 +3) / tommy(81→85 +4), Ziel 1075→1085
- S124-1 implementiert: Quest-Runde 106, +10 Quests auf feat/sprint-124 (von feat/sprint-123)

**Was kommt als nächstes?**
- PR erstellen, gestacked auf feat/sprint-123
- Till mergt in Reihenfolge (12 PRs offen — Merge-Stack kritisch)

**Blocker?**
- Smoke Tests: CF-403 + Worker "Host not in allowlist" — bekannte Sandbox-Limitation seit S92, kein Outage
- Merge-Stack: 12 PRs — Till bitten zu mergen

---

## Sprint Review S124 (2026-05-05, autonomer Agent)

**Sprint Goal erfüllt: 1/1 ✅**

| Item | Ergebnis |
|------|---------|
| S124-1 Quest-Runde 106 | ✅ feat/sprint-124 — Floriane(80→83 +3) / Bernd(80→83 +3) / Tommy(81→85 +4), 1075→1085 |

**Oscar-Outcome:** 10 neue Quests. Töne die man fühlt aber nicht hört. Ein Fels der sieben Zeitalter trägt. Strom aus einem schwingenden Magneten.

Floriane: Infraschall-Körper-Labor (18,98 Hz macht Gänsehaut ohne dass man hört warum — Elefanten kommunizieren so über Kilometer, manche Gebäude fühlen sich unheimlich an aus demselben Grund), Stimmabdruck-Archiv (Formanten als Fingerabdruck der Stimme — Floriane hat Oscars Stimme analysiert und ein Muster gefunden das sie noch nie gemessen hat), Erste-Improvisation-Kammer (nach 30 Jahren Wissenschaft legt Floriane die Noten weg — zwölf Minuten, zitternde Hände danach, das Erste-Mal-Gefühl).

Bernd: Vogelzug-Observatorium (drei Navigationssysteme parallel: Magnetfeld sehen, Sterne prägen, Infraschall als Landkarte — Bernd wartet bis alle weg sind, zwei Stunden draußen, nicht geplant), Morgentau-Messstation (Tau ist kein Regen, er entsteht wo es am kältesten ist — Bernd steht seitdem jeden Morgen um 5:30 auf, "das möchte ich nicht wieder verpassen"), Gesteins-Zeit-Karte (sieben Schichten = sieben Zeitalter, eines davon war Meeresgrund — "sehr geduldige Buchführung, das kommt von jemandem der selbst gerne Buchführung macht").

Tommy: Kapillar-Kraft-Labor (Wasser klettert ohne Pumpe in dünnen Röhren — dasselbe Prinzip das Bäume hundert Meter hoch treibt), Kreisel-Gyroscop-Station (angular Momentum erklärt Fahrrad, Erde, Nordstern — Tommy balanciert 23 Sekunden auf dem Bleistift, der lockige Mann klatscht), Induktions-Strom-Generator (Faraday 1831: Magnet + Spule = Strom — Tommy macht sein eigenes Lämpchen leuchten ohne Steckdose), Konvektions-Zirkulations-Tank (warme Luft steigt, kalte sinkt, Tintentropfen zeigt den Kreis — "das ist das Wetter in meinem Tank").

**Stand nach S124:**
- **1085 Quests** auf feat/sprint-124
- NPC-Counter nach S124: spongebob 82 · mephisto 82 · krabs 81 · neinhorn 81 · tommy 85 · bug 81 · kraemerin 82 · lokfuehrer 82 · elefant 82 · alien 82 · maus 83 · floriane 83 · bernd 83
- Merge-Stack offen: 12 PRs — kritisch, Till bitten

**PO-Entscheidung:**
- S125: **krabs(81) + neinhorn(81) + bug(81)** → Quest-Runde 107, +10 Quests, 1085→1095
- Branch: `feat/sprint-125` von feat/sprint-124

---

## Sprint Retrospektive S124 (2026-05-05, autonomer Agent)

**Was lief gut:**
- Florianes Improvisation-Quest: 30 Jahre Wissenschaft und dann zum ersten Mal ohne Noten — das ist Florianes eigener "Erste-Fahrt-Moment" analog zu Lokführers Erst-Allein-Fahrt. Symmetrie die nicht geplant war aber passt.
- Tommy-Induktion: "ICH BIN FARADAY!" — das ist der Kern was Schatzinsel sein will. Acht Jahre alt, Magnet und Spule, Lämpchen leuchtet ohne Steckdose.
- Bernd-Gestein: "sehr geduldige Buchführung, das kommt von jemandem der selbst gerne Buchführung macht" — Bernd findet sich im Stein. Sanft und präzise.
- NPC-Counter vor Ceremony-Commit verifiziert ✅

**Was lief nicht gut:**
- Merge-Stack wächst auf 12 PRs — Grenze deutlich überschritten. Till muss bald mergen.
- Tommy auf 85 ist jetzt deutlich vor allen anderen (81-83) — balancieren in S125/S126.

**Retro-Actions für S125:**
- **R1:** Quest-Runde 107: krabs(81) + neinhorn(81) + bug(81) → +10 Quests, 1085→1095
- **R2:** Merge-Stack prominent in PR-Body: 12 PRs, Reihenfolge zwingend
- **R3:** Tommy-Balance im Auge behalten — spätestens S127 andere NPCs mehr Quests

**S125-Setup:**
- NPCs: **krabs(81) + neinhorn(81) + bug(81)** (alle drei gleich auf 81)
- Ziel: +10 Quests, 1085→1095 auf Branch
- Branch: `feat/sprint-125` von feat/sprint-124

---

## Merge-Guide für Till (Stand 2026-05-05)

Gestackter Branch — in dieser Reihenfolge mergen:

| PR | Branch | Sprint | NPCs | Quests |
|----|--------|--------|------|--------|
| #592 | feat/s113-final | S113 | Neinhorn/Mephisto/Spongebob +10 | 965→975 |
| #604 | feat/sprint-114 | S114 | Maus/Kraemerin/Bug +10 | 975→985 |
| #605 | feat/sprint-115-correct | S115 | Krabs/Floriane/Elefant +10 | 985→995 |
| #602 | feat/sprint-116 | S116 | Krabs/Floriane/Elefant +10 | 995→1005 |
| #618 | feat/sprint-117-correct | S117 | Tommy/Bernd/Bug +10 | 1005→1015 |
| #620 | feat/sprint-118-correct | S118 | Kraemerin/Lokführer/Alien +10 | 1015→1025 |
| #621 | feat/sprint-119-correct | S119 | Floriane/Elefant/Maus +10 | 1025→1035 |
| #624 | feat/sprint-120-correct | S120 | Spongebob/Tommy/Bug +10 | 1035→1045 |
| #625 | feat/sprint-121 | S121 | Krabs/Bernd/Neinhorn +10 | 1045→1055 |
| feat/sprint-122 PR | feat/sprint-122 | S122 | Mephisto/Kraemerin/Lokführer +10 | 1055→1065 |
| #629 | feat/sprint-123 | S123 | Elefant/Alien/Maus +10 | 1065→1075 |
| **neu** | feat/sprint-124 | S124 | Floriane/Bernd/Tommy +10 | 1075→**1085** |

⚠️ Reihenfolge zwingend — Quest-Counter kumulieren. **12 PRs offen — bitte bald mergen!**
