# Comic Magazine-File Labels

V2 generates full-height, print-ready matte-vinyl front labels for IKEA-style comic magazine files.

## Start here

```powershell
npm install
npm start                 # Build, preserve/migrate the artwork cache, and open the local editor
npm run check             # TypeScript/Vue checks, core tests, catalog/research validation, and local-asset audit
npm run build             # Produce the self-contained preview in dist/v2/
```

Use `npm start` for crop or shared-layout changes. The editor saves approved artwork/crop changes to `config/labels.json` and permitted shared settings to `config/layout.json`; rebuild after saving before print proofing.

## Repository guide

```text
config/              Human-edited layout, category, and ordered label configuration
logos/               Constrained source SVG logos for V2
src/core/            Shared configuration, validation, paths, crop, color, and serialization helpers
src/build/           Preview-build configuration embedding and logo preparation
src/editor-server/   Local editor server, artwork cache, API edits, and static serving
src/tools/           Audits, catalog update commands, research harvests, and migrations
web/                 Vue editor and print/shelf-preview UI
docs/design/         Governing design and physical-production brief
docs/planning/       Deliberate future additions and collection splits
docs/history/        Historical snapshots; not the current catalog
docs/research/       Durable Marvel and non-Marvel cover-research inventories
```

`config/labels.json` order is the intended label and print order. Keep its changes intentional.

## Artwork cache

The editor eagerly preloads configured candidate artwork. Downloaded remote images are stored in ignored `.cache/artwork/`, separate from generated `dist/` output. `npm run build` and `npm run serve` automatically migrate an older `dist/artwork-cache/` into the new location by move, preserving its source-URL index and cached images.

## More detail

Read [the design brief](docs/design/DESIGN-V2.md) for physical-production and visual-system constraints, [the artwork research guide](docs/ARTWORK-RESEARCH.md) for cover sourcing, and [AGENTS.md](AGENTS.md) for repository-specific implementation rules.
