# Comic Magazine File Label System V2

**Status:** governing V2 design and physical-production brief
**Updated:** 2026-07-30
**Supersedes:** the earlier partial V2 proposal, now revised against the complete prior design discussion and current decisions.

## Goal

Build a cohesive, durable, professionally manufactured-looking visual identity for comic storage in IKEA cardboard magazine files. The system should generate labels procedurally through TypeScript and HTML/CSS, scale to hundreds of boxes over decades, and make the wall read as a curated archival collection rather than a set of handmade labels.

The design unit is the **shelf**, not an isolated label. The desired reaction is “Where did you buy those?”

## What V1 does today

V1 is a compact static generator:

- `config.json` contains the physical format and collection data: 37 series records, 89 physical labels, and 145 content/subseries entries.
- The predecessor generated labels as static HTML strings; its source is retained in Git history only.
- Each V1 label is 3.875 × 9.25 in and uses a color-tinted cover image, logo, and bottom white information panel.

V1 proved the useful idea: labels can be generated rather than individually designed. Its weaknesses are durability (office paper and spray adhesive), repeated configuration, remote/mixed assets, and a visual hierarchy in which art, logo, years, and metadata all compete.

## Core design decisions

### Hierarchy

The intended visual priority, from room scale to close range, is:

1. Color family
2. Series logo
3. Years
4. Artwork
5. Metadata

This deliberately reverses V1’s emphasis. At shelf distance the collection family, logo, and year range should read. Close up, the issue range and other catalog information should be available without competing for attention.

### Color and white are materials

Color should generally identify a related collection family rather than every title receiving an unrelated color. Likely examples are Fantastic Four/blue, Spider-family/red, Avengers/gold, Hulk/green, and a unified X-family color. The exact grouping remains a design decision to test.

White is not blank background. It is an architectural material, alongside the white cardboard and the color-tinted artwork. Repeated white bands, thin colored rules, alignment, and spacing create the product identity.

### Artwork

- One bold image per box; no collages. The image choice should reduce visual noise while giving each box a strong, distinct graphic identity.
- Art fills the complete physical label and bleeds to its edges. The intended vinyl label extends 0.5 in past the visible file-face on its left and right edges, wrapping far enough around those sides to adhere securely and hide seams. Its height remains the file-face height.
- Prefer a dramatically cropped interior panel or splash image when it gives a single strong subject, iconic pose, memorable moment, or clearer silhouette. This avoids the competing logos, word balloons, cover copy, price boxes, and other visual noise common to comic covers.
- Use a cover when it is especially iconic or artistically significant. Consistency comes from the shared treatment and design language, not from always using covers or always using interior art.
- **Current sourcing concession:** high-resolution interior-panel art is not reliably available for the collection at present. Until it is, use focused close-ups of cover art as the normal practical source, choosing crops with a strong subject and minimal cover-copy distraction. This is a temporary availability constraint, not a change to the preference for strong interior panels or splashes when suitable high-resolution sources can be obtained.
- Do not use complete monochrome. Reduce saturation and apply the category color tint while preserving enough tonal range and original color for the artwork to remain recognizable.
- Halftone, threshold, line-art, and fade treatments are rejected as default system rules: they risk becoming the visual subject themselves.

### Structural layout

Every label follows the same architecture:

1. A thin category-color rule runs across the complete vinyl piece, including the physical overwrap, as the consistent header.
2. A prominent, horizontal white **identity band** runs across that same full width just above the finger hole. Thin category-color rules border its top and bottom.
3. The identity band contains the very large logo and a large full year range. The logo should use roughly 90–95% of its available width when the mark permits. In the current `condensed-range` mode, boxes with several dated contents show one range from the first start year through the last end year in the label’s configured order, rather than a noisy list of separate spans; `separate-ranges` remains an available layout option.
4. Artwork continues beneath the identity band and around the finger hole.
5. The finger hole is a deliberate divider, not an obstruction: identity is above it; catalog information is below it.
6. A smaller, separately bordered white **metadata band** below the hole contains only necessary issue ranges, contained-series names, and optional short notes. It also runs across the complete vinyl width.
7. The fixed-height bands line up identically across all boxes, producing deliberate horizontal flow on a shelf. Artwork remains the field between and around those bands rather than turning the whole side into an edge-to-edge white card.

Horizontal structure is intentional: shelves are experienced horizontally, and repeated aligned bands make a row feel like one designed product.

### Physical format and finish

- Magazine file face: **3.875 × 11.75 in**.
- The centered finger hole is a downward-facing perfect half circle: its flat edge is on top and its curve is below. It lies approximately 1.5–2.5 in from the bottom and is about 1.75 in wide at its widest point.
- The label covers the entire face and extends 0.5 in on the left and right only, for a final physical size of **4.875 × 11.75 in**. Artwork intentionally runs through the hole area; after application, that area is cut out.
- The metadata band occupies the lower region beneath the finger hole.

The layout configuration contains an intentionally undersized graphical cut guide (initially 90% of the nominal hole diameter). The physical IKEA-file opening is the final cutting reference; the smaller guide prevents imperfect box manufacturing or placement from exposing important white-band content.

The preferred finish is professionally printed **matte adhesive vinyl**, replacing office paper and spray adhesive. It should be cleaner, more durable, easier to apply, and closer to a manufactured product. A full-height label requires a vendor/material workflow that supports the custom face plus a 0.5 in overwrap on each intended edge; V1’s US Letter layout is no longer the physical output constraint.

This physical overwrap is distinct from **printer bleed**. The final vinyl piece is deliberately larger than the visible face so it can fold around the file edges; the printer may also require additional hidden artwork beyond that final cut line. The vinyl vendor’s template should determine the latter allowance.

## Logo system

Historical logos remain part of the collection. Fantastic Four labels, for example, continue to select era-appropriate marks. V2 standardizes **presentation**, not Marvel history.

### Logo assets

Logos should become cleaned SVG assets through a one-time, human-reviewed workflow:

```
reference image → crop → contrast/threshold → trace to SVG → brief cleanup → reusable asset
```

The result should retain geometry and recognition while removing gradients, glows, shadows, textures, JPEG artifacts, and incidental lighting. Use the minimum number of flat fills—normally one, occasionally two—needed for the logo to remain itself. Do not add universal drop shadows; an optional shared CSS stroke/outline can be tested for readability before it becomes a rule.

SVG owns the logo geometry and one/two semantic fills. CSS owns shared presentation: color tokens, scale, placement, and any approved outline. The renderer inlines local SVGs (rather than treating them only as `<img>` files) so these styles can be applied programmatically; existing remote PNG/JPEG logos remain raster fallbacks during migration.

SVG source files use a deliberately constrained preparation rule: one black fill, or black plus gray. During the build, the preparation step reads untouched source SVGs, assigns the lower-luminance fill to `primary` and the higher-luminance fill to `secondary`, then writes a normalized SVG with `data-logo-fill` attributes into `dist/`. It rejects SVGs with more than two supported fill colors. The renderer inlines that generated SVG and maps primary to the category color and secondary to a globally configurable, desaturated `category-muted` version of that color. A globally configurable, optional black non-scaling outline separates adjacent colored logo shapes and preserves fine lettering. Its configured width also provides matching safe padding around inline SVGs, preventing a source SVG’s original bounds from clipping the outline. This removes per-logo color mapping from the catalog while keeping the source SVGs untouched and reviewable.

## Configuration model

Split the collection into two human-editable catalog files plus one global production file:

```
config/
  layout.json       # physical size, hole guide, fixed bands, art treatment, typography
  categories.json   # category identity, color, named logo variants and logo options
  labels.json       # one ordered record per physical magazine file
```

`categories.json` defines reusable identity. `labels.json` describes individual boxes in print order. This removes duplicate “series” entries created only to select a different Fantastic Four logo, but keeps contents directly on the physical label where they are easiest to edit.

```json
// categories.json
{
  "fantastic-four": {
    "name": "Fantastic Four",
    "color": "#78a9ff",
    "logos": {
      "classic": { "asset": "logos/fantastic-four/classic.svg" },
      "1970": { "asset": "logos/fantastic-four/1970.svg" }
    }
  }
}
```

```json
// labels.json
{
  "id": "ff-1961-001-025",
  "category": "fantastic-four",
  "logo": "classic",
  "art": {
    "asset": "covers/fantastic-four/ff-v1-003.jpg",
    "crop": { "focus": { "x": 0.44, "y": 0.28 }, "scale": 1.08 }
  },
  "contents": [
    { "name": "Fantastic Four", "issues": [1, 25], "years": [1961, 1964] }
  ]
}
```

Crop coordinates use a normalized focal point plus scale instead of printed-inch `top`/`left` offsets. This is easier to understand and survives layout changes. The shared design dials—overwrap, header/rule thickness, band positions and exact heights, hole geometry/guide scale, artwork saturation/contrast/brightness/tint/blend mode, and type sizes—live in `layout.json`. A category may override the shared artwork treatment only when there is a deliberate reason.

## Local asset library

Assets should be supported as a local, gitignored working library rather than assumed to be committed:

```
assets/
  covers/fantastic-four/ff-v1-003.jpg
  logos/fantastic-four/classic.svg
```

The committed catalog records logical asset paths and optional original-source URLs/notes. A build audit reports missing local assets clearly by label and asset ID instead of silently emitting broken imagery. The asset library can evolve independently as covers are upgraded and logos are cleaned.

## Generator direction

Keep this a small TypeScript/Vue label system with a static print preview and a local-only editor. The local editor is deliberately part of the workflow: it lets a curator compare eager-preloaded candidates, refine crops, and save only approved configuration changes. No hosted service or additional framework is needed. V2 includes:

- explicit `build`, `typecheck`, catalog-validation, preview, and asset-audit commands;
- configuration validation for IDs, ranges, crop values, logo references, and asset presence;
- a shared core used by the build, local editor, and catalog/research tools;
- SVG inlining and a custom-size output suitable for vinyl-print proofing/production;
- a persistent artwork cache outside generated output so full candidate preloads do not need to redownload.

Handlebars is not required at this stage. The substantial work is layout, assets, validation, and print output; a simple component/render-function boundary is clearer for one label layout. A template engine becomes worthwhile only if the project grows multiple materially different artifacts, such as divider cards, reverse labels, inventory sheets, or alternate layouts.

## Working delivery plan

The current decision is to **redesign and render every configured label**, not stop after a small pilot set. A handful of consecutive Fantastic Four boxes and other difficult labels will still be watched closely as calibration cases while the complete catalog is produced.

1. Install dependencies and establish a reproducible baseline build.
2. Create the new layout/config foundations and validation layer.
3. Convert all existing configured labels to the V2 model and render the complete collection with available art/assets.
4. Calibrate the shared rules against screen and real vinyl proofs: tint strength, band proportions, logo scale, year size, stroke decision, and metadata density.
5. Build out the local asset library: cleaned SVG logos, stronger cover/panel choices, and new box records for the sticky-note labels.
6. Run final asset/config checks and produce the print-ready vinyl output.

## Decisions still to make

- Exact category/family color grouping, especially for the X-family.
- Final year formatting: current preference is a large full range such as `1961–1963`, but abbreviated years and a single start year remain alternatives.
- Exact identity-band and metadata-band dimensions, insets, rule thickness, typography, and art/tint formula.
- Whether a shared CSS stroke improves all logo families sufficiently to adopt.
- Matte-vinyl vendor, substrate, proof process, which edges receive the 0.5 in physical overwrap, the vendor’s separate print-bleed requirement, and how the finger-hole cutout will be executed after application.
- Whether detailed multi-title lists stay on labels or are reduced to issue/year ranges with detailed cataloging kept elsewhere.
- Whether V2 later expands beyond front labels to divider cards, inventory views, reverse labels, or QR codes.
- We also need to print one or two full size tests, just to makes sure everything lines up

## Collection expansion queue

The V2 catalog is intentionally not final. Additions and redivision should use the new `labels.json` model once the relevant comics and assets are ready:

- **Fantastic Four:** add at least one physical box for the most recently cataloged Fantastic Four material.
- **Uncanny X-Men:** inspect and read through the current unprocessed stack, then add roughly three physical boxes and choose sensible divisions across the broader c. #125–300 run. The current holdings include #131, #132, #137–200, and a substantial portion of #200–300; the eventual label boundaries should follow the actual read/cataloged collection rather than be guessed now.
- All the other new boxes that don't have labels yet.
- Look for other existing boxes that are too tightly packed and separate them out into multiple boxes. (I suspect the FF miniseries boxes may be a candidate here.)
- Naturally, use Codex to update and fill out the configurations.

Color-family decisions and the new-box metadata can be made together after the logo, art, and vinyl work has settled.

## Guiding principles

Consistency over per-label decoration; readability over exhaustive metadata; flexibility through generation; longevity for future additions; and historical respect through recognizable era-specific logos. The outcome should feel like a long-lived archival product, not craft labels glued onto boxes.
