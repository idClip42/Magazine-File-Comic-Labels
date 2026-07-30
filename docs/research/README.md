# Research inventories

These committed JSON files are durable, machine-readable cover-research data.
They are inputs to the resumable harvest and catalog-application tools, not
download caches or generated build output.

- `marvel/` contains official issue-page, cover, and run inventories used by
  the Marvel harvest workflow.
- `non-marvel/` contains the non-Marvel cover inventories used by their
  dedicated harvesters.

Keep records reviewable and preserve their ordering. Do not move them into an
ignored cache directory: a clone needs the inventories to resume research.
