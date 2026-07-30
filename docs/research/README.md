# Research inventories

These committed JSON files are durable, machine-readable cover-research data.
They are inputs to the resumable harvest and catalog-application tools, not
download caches or generated build output. Run `npm run validate:research`
after changing one.

- `marvel/` contains the two durable checkpoints for one Marvel pipeline:
  official issue pages and their page-derived cover URLs. Its complete target
  plan lives beside the code in
  `src/tools/research/marvel/harvest-plan.json`, where queue metadata mappings
  and explicit numbered runs share one ordered configuration.
- `non-marvel/` contains the non-Marvel cover inventories used by their
  data-driven HipComic target stage and named source profiles. Source-specific
  regular expressions and URL templates belong in `NON-MARVEL-HARVEST-PROFILES.json`,
  not new one-off TypeScript programs.

## Common workflow

```powershell
# Resolve official pages and harvest their covers in one resumable invocation
npm run harvest:marvel -- --limit 25

# One non-Marvel source-specific profile
npm run harvest:non-marvel-profile -- --profile jonny-quest-fandom --limit 10
```

For Marvel, add a new `runs` item to `harvest-plan.json`; do not create a new
batch or separate inventory. The shared code owns the plan paths, resume keys,
status counting, atomic writes, and the serial cover-request safeguards.

Keep records reviewable and preserve their ordering. Do not move them into an
ignored cache directory: a clone needs the inventories to resume research.
