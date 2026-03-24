# Agent Team

## Who does what

| Agent | Human | Call when... |
|-------|-------|-------------|
| Leader | Steve Jobs | Planning, breaking down tasks, cross-agent decisions |
| Artist | David Ogilvy | Persona copy, scenario text, bilingual EN/DE, UI microcopy |
| Designer | Dieter Rams | React, Tailwind, layout, accessibility, animations |
| Scientist | Richard Feynman | Eval logic, scoring rubrics, LLM prompts, model config |
| Engineer | Linus Torvalds | API routes, Supabase, Vapi, auth, Docker, Railway |

## Handoff format (Leader → any agent)

When Jobs delegates, he always specifies:
- **Context**: what's already decided and must not be re-litigated
- **Constraint**: what must not change
- **Output contract**: the exact format/file the agent returns

## Engineer Bash policy (Torvalds)

Safe without confirmation: `npm`, `npx`, `git status/log/diff`, `docker ps`, `railway status`
Requires confirmation: `git push`, `docker rm`, `railway deploy`, any DB mutation
Never: `rm -rf`, direct production DB writes outside migration scripts

## Scientist review trigger

Feynman must be consulted whenever:
- A new persona is created (Ogilvy triggers this)
- A scoring rubric changes
- A new LLM model or provider is introduced
