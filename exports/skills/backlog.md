# /backlog — Idea-capture and triage session

Enter plan mode, collect free-form ideas from the user, run Jobs (Leader) to triage each idea, and write sorted insertions into `docs/BACKLOG.md`.

---

## What this skill does

1. Enter plan mode — tell the user you are ready and ask them to dump their ideas
2. Wait for the user to finish (they will say "done", "that's it", or similar)
3. Run Jobs (Leader agent) to triage every idea and produce a sorted insertion plan
4. Write the sorted ideas into `docs/BACKLOG.md` at the correct priority tier
5. Exit plan mode and summarise what was added

---

## Step 1 — Open the session

Use the **ExitPlanMode** tool to enter plan mode.

Then say exactly this (adapt language to match the user's locale if obvious):

> **Backlog open.** Dump your ideas — one per line, or as many sentences as you need.
> I'll capture everything. Say **"done"** when you're finished.

Do not ask clarifying questions yet. Just receive.

---

## Step 2 — Receive ideas

Collect everything the user writes until they signal they are done.
A "done" signal is any of: "done", "that's it", "that's all", "fertig", "das war's", or a message that is clearly a closing.

If the user keeps adding ideas after saying done, keep collecting — only triage when they go quiet for a full turn.

---

## Step 3 — Triage with Jobs

Read `docs/BACKLOG.md` so Jobs knows the current state before inserting.

Invoke the **Leader** agent (Steve Jobs, High D) with this exact brief:

> "You are Steve Jobs acting as product owner for this project.
>
> Current backlog is below. The user has submitted the following raw ideas:
>
> ---
> [paste every idea the user submitted, verbatim]
> ---
>
> Your job:
> 1. For each idea, decide: is it a **new backlog item**, a **refinement of an existing item**, or **icebox material** (valid but not now)?
> 2. For new items: assign a Priority tier (1–6, matching the existing tiers), write a one-line item description in the backlog table format (`| ID | Item | Status | Est. |`), assign a new ID that follows the existing numbering, estimate hours, and set Status to ❌.
> 3. For refinements: state which existing item ID they belong to and what to append to its description.
> 4. For icebox items: write a one-line entry for the Icebox section.
> 5. Output a JSON array called `insertions` with this shape:
>
> ```json
> [
>   {
>     "type": "new" | "refinement" | "icebox",
>     "tier": 1,
>     "id": "1.6",
>     "item": "One-line item description",
>     "est": "2h",
>     "existing_id": null,
>     "refinement_text": null,
>     "icebox_text": null
>   }
> ]
> ```
>
> Be decisive. If an idea is vague, make a reasonable interpretation and note it. If an idea duplicates an existing item exactly, mark it as a refinement with a note to close the duplicate.
>
> Current backlog:
> [paste full contents of docs/BACKLOG.md]"

---

## Step 4 — Write to backlog

Parse Jobs' `insertions` array and apply each insertion to `docs/BACKLOG.md`:

- **new**: insert a new row in the correct Priority tier table, respecting ID order
- **refinement**: append the refinement text to the matching row's Item description
- **icebox**: append a bullet to the `## Icebox` section

Update the `**Last updated:**` date at the top to today's date.

Update the `**Hours at a glance**` table if new items were added to a tier.

Write the file using the Edit tool (prefer Edit over Write to avoid clobbering).

---

## Step 5 — Summarise

Exit plan mode (if still in it) and print a concise summary:

```
## Backlog updated

**Added [N] items · [M] refinements · [K] to icebox**

| Priority | ID | Item | Est. |
|----------|----|------|------|
| ...      | .. | ...  | ...  |

**Icebox additions:** [list or "none"]
**Refinements:** [list or "none"]
```

Then ask: *"Anything else to add, or shall I commit this?"*

If the user says yes / commit / push — commit `docs/BACKLOG.md` with message:
`chore(backlog): add [N] items from idea-capture session`
and push to the current branch.

---

## Rules

- Never delete or reorder existing backlog items — only insert
- Never change existing item statuses
- IDs must follow the existing `tier.sequence` pattern (e.g. if tier 2 ends at 2.5, next is 2.6)
- If Jobs marks something as icebox, do not put it in a priority tier table
- Keep Jobs' reasoning visible — after the backlog update, show a one-line rationale for each triage decision
- The session stays open until the user explicitly closes it or commits
