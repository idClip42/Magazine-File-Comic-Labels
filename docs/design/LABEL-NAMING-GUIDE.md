# Label naming guide

## Purpose

`contents[].name` is a shelf-facing collection label, not a complete
bibliographic citation. It should let a person identify a file quickly while
remaining consistent enough to browse in `config/labels.json`.

## Series titles

- Use the publisher's canonical series title, with its established spelling,
  capitalization, hyphenation, punctuation, and article. Prefer the publisher
  catalog or the series indicia when they differ from a cover logo.
- Do not mechanically add or remove **The**. Keep it when it belongs to the
  canonical title (`The Amazing Spider-Man`, `The New Teen Titans`, `The
  Shadow`); omit it when the selected series title does (`Uncanny X-Men`, `New
  Mutants`, `Ultimate Spider-Man`).
- Write titles in title case. Preserve intentional punctuation such as
  `Teen Titans Go!`, `What If?`, `Spider-Man`, `She-Hulk`, and
  `Marvel Two-In-One`.
- Record a relaunch number in `volume`, not in the title. The renderer supplies
  the `Vol.` label, so names never include `Vol.`, years, issue numbers, or
  parenthetical volume information.

## Collection buckets

When one physical file deliberately groups material rather than representing
one ongoing series, use the shortest clear title-family bucket:

- `[Title] Annual` for annuals.
- `[Title] One-Shots` for standalone issues and specials that are not a
  coherent mini-series.
- `[Title] Miniseries` for bounded limited series.
- `[Title] Misc.` for a small residual grouping that does not fit one of the
  preceding buckets. Use `Misc.` exactly; do not use `Various Series` or an
  explanatory parenthesis for the same purpose.
- Use a descriptive family bucket only when it improves retrieval, such as
  `[Title] Reprints` or `[Title] Movie Tie-Ins`.

The umbrella title may be shorter than every constituent book when that is the
point of the grouping. For example, `X-Men Annual`, `She-Hulk`, `007`, and
`Universal Monsters` are intentional shelf families, not claims that every
item has that exact indicia title.

## Publisher qualifiers

Use `[Title] (Publisher)` only when the publisher identifies a materially
distinct publishing line and the title plus displayed years would otherwise be
ambiguous. `Indiana Jones (Dark Horse)` meets that test. Do not add a
qualifier merely because a publisher exists; `Jonny Quest` does not need
`(Comico)` when its years and issue run already identify the line.

## Change discipline

- Do not rename stable label IDs to follow display-name edits.
- Apply a naming correction to every matching `contents` entry in the catalog.
- Keep label records in their established physical/print order.
- Run catalog validation and inspect the label preview after changing names.
