# DC Universe Infinite cover research

## Confirmed strategy

DC Universe Infinite's public series pages expose each issue's official book
link and a DC-hosted Imgix cover image. The image supplied to the page normally
contains display transformations such as `w`, `h`, `fit`, `fill`, `sharp`, and
`auto`. Those are **not** part of the cover's identity.

Use the image path without its query string, provided it has this shape:

```text
https://imgix-media.wbdndc.net/ingest/book/preview/<book-uuid>/<asset-uuid>/0.jpg
```

The `0.jpg` resource is the first (cover) page, and the query-free response is
the full source rendition served by DC's CDN. Do not infer either UUID or
substitute a non-zero page number. Retain the public book URL alongside each
cover as its provenance.

Young Justice (1998-) #1 and #55 were independently checked on 2026-07-31:
their query-free cover URLs returned JPEGs at 1076 x 1650 and 1073 x 1650,
respectively. The corresponding page thumbnails use 375 x 576 display
transformations, so removing those parameters materially improves print
quality.

## Reusable harvest workflow

The `dc-universe-infinite` profile kind in
`NON-MARVEL-HARVEST-PROFILES.json` harvests a configured series from its public
series-page pagination. Set `pages` to the number of public pages required to
expose the complete bounded run; requests are sequential with a 500 ms gap. It
matches the configured, visible issue-title prefix, records the issue's book
URL as `listingUrl`, and canonicalizes its cover URL by removing Imgix
parameters. It accepts only the official
`imgix-media.wbdndc.net/ingest/book/preview/.../0.jpg` shape; an unexpected
path fails instead of silently recording a thumbnail or interior page.

For a new DC series:

1. Add its bounded label issue ranges to `NON-MARVEL-HIPCOMIC-TARGETS.json` if
   they are not already represented in the common inventory.
2. Add a `dc-universe-infinite` profile with exact label IDs, the public DCUI
   series URL, and the visible issue-title prefix.
3. Run `npm run harvest:non-marvel-profile -- --profile <profile-id> --refresh`.
   The configured public pages are fetched sequentially; ordinary resume
   behavior is retained for the individual inventory records.
4. Inspect found entries, then run `npm run apply:non-marvel-covers -- --write`
   only when the catalog should deliberately adopt the refreshed options.

Use the public catalog pages conservatively. A DCUI series page may include
collections or specials alongside single issues; the harvester only updates
inventory records whose issue numbers and label IDs are already configured.
