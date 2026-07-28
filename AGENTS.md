# Comic Magazine-File Labels

## Project purpose

This repository generates full-height, print-ready front labels for IKEA-style
cardboard comic magazine files. The intended product is a durable matte-vinyl
covering, not a US Letter sheet of stickers. Labels use a shared architectural
layout: color-tinted artwork, a white identity band above the finger hole, and
a white metadata band below it. The priority at shelf distance is color family,
logo, and years; issue and collection details are secondary.

The root project is **V2**, the active implementation. `legacy/v1/` is a
read-only historical archive of the first generator and is useful as a source
of provenance, but should not be extended for normal V2 work.

## Repository map

```text
config/
  layout.json       Global physical dimensions, typography, treatment, print guides
  categories.json   Seven color families and their reusable logo variants
  labels.json       Ordered records for each physical file (the primary catalog)
logos/              Committed, constrained SVG source logos for V2
src/
  index.ts          Build entry point; writes `dist/v2/index.html`
  render.ts         HTML/CSS generator and browser crop-control script
  config.ts         Loads the three JSON configuration files from the repo root
  types.ts          V2 configuration contract
  color.ts          Category-color and muted-logo-color helpers
  logo-prep.ts      Inlines/prepares local SVGs and writes a logo manifest
  audit.ts          Checks only referenced local assets
  *-cli.ts          Small command-line entry points
scripts/
  convert-v1-config.ts  One-time V1-to-V2 migration utility
legacy/v1/          Preserved V1 generator/configuration; do not treat as active
DESIGN-V2.md        Authoritative design rationale and physical-production brief
LABEL-INVENTORY.md  Snapshot of the original 89-label inventory
ADDITIONAL-LABELS.md Planned additions/splits still to be cataloged
COLOR-CATEGORY-PROPOSAL.md  Rationale for the seven V2 color families
TODO.md             Short current working notes
```

`dist/`, `imgs/`, and `assets/` are ignored working/output directories. Do not
rely on them being available in a clone and do not commit generated output or a
personal asset library unless explicitly asked.

## Build and verification

Run commands from the repository root:

```powershell
npm run typecheck       # TypeScript checks only
npm run audit:assets    # Report missing referenced local files
npm run build           # Compile, prepare SVGs, and generate dist/v2/index.html
npm start               # Alias for the full build
npm run prepare:logos   # Prepare/logo-audit SVGs without generating the document
```

Open `dist/v2/index.html` in a browser to inspect the labels. It includes crop
sliders and numeric inputs; the Copy button produces the replacement `crop`
JSON fragment for the matching record in `config/labels.json`. Crop controls
are deliberately excluded in print media.

Always run `npm run typecheck` after TypeScript changes. Run `npm run build`
after changes to layout, rendering, logos, category definitions, or labels; it
also catches SVG-preparation failures. Run `npm run audit:assets` whenever an
asset path changes. The current catalog deliberately references remote artwork,
so a clean audit only means any referenced *local* files exist.

## V2 configuration model

Keep catalog data separate from rendering code. Preserve the ordering of
`labels.json`: it is the intended label/print order.

- `layout.json` controls the physical 3.875 x 11.75-inch face, 0.125-inch
  overwrap, finger-hole guide, fixed bands, type sizes, artwork treatment,
  logo palette/outline, and print/screen behavior. Make shared visual changes
  here rather than adding label-specific CSS.
- `categories.json` holds the seven shelf-level families: Fantastic Four,
  X-family, Marvel characters, Marvel specials, DC Universe, adventure & pulp,
  and horror & dark fantasy. A category declares one hex color, named logo
  assets, optional per-logo width limits, and (only when justified) an artwork
  treatment override.
- Each `labels.json` object represents one physical file and has a stable
  unique `id`, a valid `category` and category-local `logo`, `art.asset`, an
  `art.crop` focal point (`x`/`y` normalized from 0 to 1) plus `scale`, and one
  or more ordered `contents` entries. Contents may include `name`, `volume`,
  `[start, end]` issue ranges, and `[start, end]` year ranges.

Keep ranges inclusive and use `[n, n]` for a single issue/year. In
`condensed-range` year mode, the displayed range runs from the first content
entry's starting year to the last entry's ending year, so maintain chronological
content order. Use concise metadata: detailed cataloging belongs elsewhere if
it harms label readability.

## Assets and logos

Asset paths are either absolute HTTP(S) URLs or paths relative to
`layout.localAssetRoot` (currently the repository root). The renderer adjusts
local paths for the generated `dist/v2/` document. Prefer stable, reviewable
assets and do not silently replace a carefully chosen crop or era-specific
logo.

V2 local SVG sources belong in `logos/`. The preparation pipeline supports
filled `<path>` elements using black, gray, or 3/6-digit hex fills. A source
must have one or two supported fills: the darker fill becomes `primary`, the
lighter `secondary`. During build the source remains untouched; a normalized
copy and `logo-preparation.json` are written under `dist/v2/`, while the SVG
markup is inlined into the generated HTML and colored with CSS. SVGs with no
supported fills or more than two fail the build. Remote and non-SVG logo assets
are rendered as raster fallbacks.

When adding a logo, use the documented workflow in `DESIGN-V2.md`: clean it to
simple, recognizable geometry with one or two flat fills. Do not add gradients,
textures, shadows, or per-logo presentation hacks unless the design decision is
intentional and documented.

## Design and print constraints

- Treat `DESIGN-V2.md` as the governing design brief; retain the shared layout
  and hierarchy unless the task explicitly changes the system.
- The 0.125-inch overwrap is physical material that folds around the file; it
  is not a printer-bleed setting. Confirm any additional vendor bleed against
  that vendor's template.
- The displayed finger-hole guide is intentionally undersized. It is a placing
  aid, not the final cutting template; the actual file opening is authoritative.
- Prefer one bold cover or interior-panel image per label. Artwork should be
  recognizable but subordinate to the color/logo/year system.
- Preserve semantic/era-specific logo selection, especially across Fantastic
  Four labels. Use the category family color for shelf coherence rather than
  inventing title-specific colors.

## Safe change workflow

1. Inspect the relevant category, label records, and existing assets before
   editing; catalog changes are collection decisions, not generated data.
2. For a new physical file, add one ordered label record, reuse or add a named
   logo variant, choose its color family, and supply a focused crop.
3. Build and inspect the affected label in `dist/v2/index.html`; use the crop
   controls to refine the focal point/scale, then copy the value back into the
   source JSON.
4. Run typecheck, a build, and the local-asset audit. Review generated output
   at print size before approving physical-production changes.

The migration scripts are intentionally conservative. `npm run convert:v1`
will refuse to overwrite existing V2 catalog files; use its `:force` variant
only when the explicit goal is to regenerate the V2 catalog from the archived
V1 data and discard manual V2 catalog edits.

## Scope and conventions

- This is intentionally dependency-light: TypeScript plus `ts-node`; avoid
  adding a web framework or server for ordinary label work.
- There is no automated test suite. Typechecking, asset audit, build success,
  and browser/print proofing are the required checks.
- Do not edit generated `dist/` files as source. Do not modify `legacy/v1/`
  unless the task specifically concerns the archive or migration behavior.
- Treat catalog edits as intentional collection decisions; avoid bulk
  regeneration unless the user explicitly requests it.
