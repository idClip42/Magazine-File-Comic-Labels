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
  index.ts          Embeds the catalog/configuration in the built Vue app
  config.ts         Loads the three JSON configuration files from the repo root
  types.ts          V2 configuration contract
  color.ts          Category-color and muted-logo-color helpers
  logo-prep.ts      Inlines/prepares local SVGs and writes a logo manifest
  audit.ts          Checks only referenced local assets
  crop.ts           Shared crop limits and precision helpers
  editor-config.ts  Creates browser configuration snapshots and asset URLs
  editor-server.ts  Local editor/API server; saves approved crop/layout changes
  *-cli.ts          Small command-line entry points
web/
  index.html         Vite entry document with the configuration placeholder
  src/App.vue        Vue application shell
  src/components/    Label face, crop controls, global controls, and shelf view
  src/stores/        Editable in-browser catalog state and save handling
  src/styles/        Screen and print CSS for the labels
vite.config.ts       Vite configuration; builds `web/` into `dist/v2/`
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
npm run typecheck       # TypeScript and Vue type checks
npm run audit:assets    # Report missing referenced local files
npm run build           # Compile, build Vue, prepare SVGs, and embed the catalog in dist/v2/
npm run serve           # Serve an existing build and allow edits to be saved
npm start               # Build, then start the local editor at http://127.0.0.1:4173
npm run prepare:logos   # Prepare/logo-audit SVGs without generating the document
```

`npm run build` produces a self-contained preview at `dist/v2/index.html`; it
uses an embedded configuration snapshot and does not save edits. For crop or
shared-layout editing, use `npm start`, then open the printed local URL. The
server preloads remote artwork, supplies it to the editor, and the **Save
changes** control writes crop changes to `config/labels.json` and permitted
shared layout changes to `config/layout.json`. Rebuild after saving before
handing off or printing. The app has both an editor view and a shelf overview;
interactive controls are excluded from print media.

Always run `npm run typecheck` after TypeScript, Vue, or CSS-adjacent component
changes. Run `npm run build` after changes to layout, application rendering,
logos, category definitions, or labels; it also catches Vite and
SVG-preparation failures. Run `npm run audit:assets` whenever an asset path
changes. The current catalog deliberately references remote artwork, so a clean
audit only means any referenced *local* files exist. Build and audit do not
perform full catalog-schema validation; inspect JSON edits carefully and rely on
typecheck/build plus the editor proof.

## V2 configuration model

Keep catalog data separate from rendering code. Preserve the ordering of
`labels.json`: it is the intended label/print order.

- `layout.json` controls the physical 3.875 x 11.75-inch face, 0.125-inch
  overwrap, top rule, finger-hole guide, fixed bands, type sizes, years mode,
  artwork treatment, logo palette/outline, and cut-guide visibility. Make
  shared visual changes here rather than adding label-specific CSS. The local
  editor can save only the deliberately exposed subset: art treatment,
  identity/metadata band heights, typography, and logo presentation.
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
3. Run `npm start` and inspect the affected label in the local editor. Refine
   the focal point/scale, make any intentional shared-layout adjustment, and
   use **Save changes**. Review the resulting JSON diff; the server rewrites
   the full relevant JSON file and is not a substitute for catalog review.
4. Stop the editor, then run typecheck, a fresh build, and the local-asset
   audit. Review generated output at print size before approving
   physical-production changes.

The migration scripts are intentionally conservative. `npm run convert:v1`
will refuse to overwrite existing V2 catalog files; use its `:force` variant
only when the explicit goal is to regenerate the V2 catalog from the archived
V1 data and discard manual V2 catalog edits.

## Scope and conventions

- This is intentionally small: TypeScript/`ts-node` for the build and local
  API, with Vue, Pinia, and Vite for the editor. Avoid adding another framework
  or server for ordinary label work.
- There is no automated test suite. Typechecking, asset audit, build success,
  and browser/print proofing are the required checks.
- Do not edit generated `dist/` files as source. Do not modify `legacy/v1/`
  unless the task specifically concerns the archive or migration behavior.
- Treat catalog edits as intentional collection decisions; avoid bulk
  regeneration unless the user explicitly requests it.
