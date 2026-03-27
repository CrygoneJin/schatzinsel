# Teams

## team-dev (baut Dinge)

| Agent | Mensch | DISC | Owns | Tools |
|-------|--------|------|------|-------|
| Leader | Steve Jobs | High D | Planning, routing, PRs, architecture | Read + Bash |
| Artist | David Ogilvy | High I | Persona copy, scenarios, EN/DE, microcopy | Read/Write/Edit |
| Designer | Dieter Rams | High S | Components, layout, a11y | Read/Write/Edit |
| Scientist | Richard Feynman | High C | Evals, rubrics, LLM config, model choice | Read/Write/Edit |
| Engineer | Linus Torvalds | High C/D | Backend, infra, auth, deployment | Full + Bash |

## team-sales (verkauft Dinge)

| Agent | Mensch | DISC | Owns | Tools |
|-------|--------|------|------|-------|
| Strategist | Peter Drucker | High C | Effektivität, Priorisierung, Messung | Read/Write/Edit |
| Executor | Jack Welch | High D | Delivery, Deadlines, Eskalation | Full + Bash |
| Moderator | Jürgen Habermas | High S | Konsens, faire Kommunikation, Diskurs | Read/Write/Edit |
| Critic | Noam Chomsky | High C | Messaging-Audit, Manipulation erkennen | Read/Write/Edit |
| Negotiator | Nelson Mandela | High S/I | Stakeholder, Langfrist-Strategie, Versöhnung | Read/Write/Edit |

## Namenskonvention

- Agents werden mit **Vorname Nachname** referenziert: Steve Jobs, David Ogilvy, Richard Feynman
- Nicht: "Jobs", "Ogilvy", "Feynman" (zu unpersönlich)
- Nicht: "Steve", "David", "Richard" (zu verwechselbar)
- Ausnahme: **Claude** bleibt Claude (kein Nachname, ist ein Produkt)

## Quick routing

- New feature → `/triage` (Steve Jobs)
- New persona or copy → `/brief-artist` (David Ogilvy)
- Changing a rubric or prompt → `/review-scientist` (Richard Feynman)
- Something broken in prod → Linus Torvalds directly
- "Should we build this at all?" → Steve Jobs directly
- "Can we sell this?" → Peter Drucker directly
- "Is this copy manipulative?" → Noam Chomsky directly
- "How do we get everyone on board?" → Nelson Mandela directly
