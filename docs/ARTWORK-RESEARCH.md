# Artwork Research Guide and Checklist

## Purpose

This is the durable work ledger for finding better cover-art candidates for the
label system. It records what to research, what has been learned, and what is
complete independently of any chat. `config/labels.json` remains the source of
truth for selected artwork, candidate URLs, crops, and label contents.

The initial source-research scope is Marvel only. The active checklist includes
only current labels with one clearly bounded, contiguous run of 25 issues or
fewer. Other Marvel labels stay deferred until their scope is clear. We will
add another publisher only after we have identified a similarly reliable
high-resolution source workflow.

## Research workflow

1. Choose one unchecked label below. Its label ID identifies the record to
   update in `config/labels.json`.
2. Confirm the contents and issue span in that record. Every item currently in
   the active checklist is one contiguous run of no more than 25 issues. Keep
   broad labels, several-series boxes, annuals, and unspecified miscellany out
   of the checklist until their scope has been deliberately resolved.
3. Check the official Marvel issue pages first. They usually provide the larger
   usable cover image, which is why they are the primary source. Use the issue
   page to discover a stable cover-image URL; do not manufacture or assume a
   `clean.jpg` URL from a pattern.
4. Also check Marvel Database/Fandom when available and compare image
   dimensions before choosing the source URL. It occasionally has a larger
   usable cover than Marvel. Keep the strongest small set of distinct
   candidates; this is cover selection, not an exhaustive cover archive.
5. Add the chosen candidate URLs to that label's `art.options` list in
   `config/labels.json`. Keep the current selected `art.asset` in the list.
6. Start the editor, compare the candidates, and choose/crop the winner. The
   local server caches every configured candidate at startup.
7. **Only when the candidate URLs have been added to `config/labels.json`,
   check off the item in this document.** Add a brief note below if a source,
   title, or scope decision taught us something reusable.

Existing candidates do not automatically make an item complete: they still
need the same review and confirmation process.

## What we have learned

- Official Marvel issue pages are the preferred discovery route for cover
  images because they usually provide the larger usable cover.
- Marvel Database/Fandom should still be compared by image dimensions; it can
  occasionally provide a larger usable cover than the official image.
- Candidate URLs are deliberately compact strings in `art.options`; per-option
  crops are temporary editor state. Saving persists only the selected asset and
  its crop.
- The local editor preloads configured remote candidates into its ignored disk
  cache. A failed remote URL should be replaced rather than relied on.

## Active bounded Marvel checklist

### Fantastic Four

- [ ] `fantastic-four-003` — Ready: Fantastic Four #1–25
- [ ] `fantastic-four-004` — Ready: Fantastic Four #26–50
- [ ] `fantastic-four-005` — Ready: Fantastic Four #51–75
- [ ] `fantastic-four-035` — Ready: Fantastic Four #76–100
- [ ] `fantastic-four-036` — Ready: Fantastic Four #101–125
- [ ] `fantastic-four-037` — Ready: Fantastic Four #126–150
- [ ] `fantastic-four-038` — Ready: Fantastic Four #151–175
- [ ] `fantastic-four-039` — Ready: Fantastic Four #176–200
- [ ] `fantastic-four-006` — Ready: Fantastic Four #201–225
- [ ] `fantastic-four-007` — Ready: Fantastic Four #226–250
- [ ] `fantastic-four-008` — Ready: Fantastic Four #251–275
- [ ] `fantastic-four-009` — Ready: Fantastic Four #276–300
- [ ] `fantastic-four-010` — Ready: Fantastic Four #301–325
- [ ] `fantastic-four-011` — Ready: Fantastic Four #326–350
- [ ] `fantastic-four-012` — Ready: Fantastic Four #351–375
- [ ] `fantastic-four-013` — Ready: Fantastic Four #376–400
- [ ] `fantastic-four-015` — Ready: 1997 series #1–25
- [ ] `fantastic-four-016` — Ready: 1997 series #26–50
- [ ] `fantastic-four-042` — Ready: 1997 series #51–70
- [ ] `fantastic-four-017` — Ready: legacy #500–525
- [ ] `fantastic-four-018` — Ready: legacy #526–550
- [ ] `fantastic-four-043` — Ready: legacy #551–575
- [ ] `fantastic-four-046` — Ready: 2018 series #7–28
- [ ] `fantastic-four-047` — Ready: 2018 series #29–48
- [ ] `fantastic-four-048` — Ready: 2022 series #1–13
- [ ] `fantastic-four-049` — Ready: 2022 series #14–33
- [ ] `fantastic-four-050` — Ready: 2025 series #1–18

### X-family

- [ ] `new-mutants-001` — Ready: New Mutants #1–25
- [ ] `new-mutants-002` — Ready: New Mutants #26–50
- [ ] `new-mutants-003` — Ready: New Mutants #51–75
- [ ] `new-mutants-004` — Ready: New Mutants #76–100
- [ ] `x-men-001` — Ready: Uncanny X-Men #126–150
- [ ] `x-men-002` — Ready: Uncanny X-Men #151–175
- [ ] `x-men-003` — Ready: Uncanny X-Men #176–200
- [ ] `x-men-004` — Ready: Uncanny X-Men #201–225
- [ ] `x-men-005` — Ready: Uncanny X-Men #226–250
- [ ] `x-men-006` — Ready: Uncanny X-Men #251–275
- [ ] `x-men-007` — Ready: Uncanny X-Men #276–300
- [ ] `excalibur-001` — Ready: Excalibur #1–25
- [ ] `excalibur-002` — Ready: Excalibur #26–50
- [ ] `excalibur-003` — Ready: Excalibur #51–75

### Marvel specials

- [ ] `earth-x-001` — Ready: Earth X #0–12
- [ ] `ultimate-spider-man-001` — Ready: Ultimate Spider-Man #1–24
- [ ] `ultimates-001` — Ready: Ultimates #1–24

### Marvel licensed titles

- [ ] `indiana-jones-001` — Ready: The Further Adventures of Indiana Jones #1–17
- [ ] `indiana-jones-002` — Ready: The Further Adventures of Indiana Jones #18–34

## Later publisher/source investigations

Do not add these to the active Marvel queue yet. After the Marvel process has
produced reliable candidates and source notes, investigate whether each
publisher has a dependable equivalent of the official-Marvel-page-first
workflow. Add a new checklist section only when the source approach is clear.

- **DC:** `teen-titans-go-001`, `teen-titans-go-002`, `young-justice-001`,
  `young-justice-002`, and `young-justice-003`.
