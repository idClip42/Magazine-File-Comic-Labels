# Next editor updates

## Editor navigation

- [x] Add a category filter to the editor so the label grid can be narrowed to one collection family at a time.
- [x] Keep the default view as all labels; do not add approval/status or candidate-count filters.

## Manual cover URLs

- [x] Add a compact `Cover URL` input and `Add & select` action beside the existing cover-option controls.
- [x] Validate that entered URLs are HTTP(S), reject duplicates, and show a useful load failure in the editor.
- [x] Normalize recognized Marvel CDN preview URLs to the project's required `clean.jpg` form before saving.
- [x] Append a new URL to `art.options` without removing or reordering existing candidates.
- [x] Select the newly added URL immediately, with the default centered 1x crop, so it can be adjusted in the existing editor.
- [x] Extend the editor update contract and save path to persist the expanded options list together with the selected asset/crop.

## Remote-art cache fallback

- [x] Keep serving an allowed remote artwork URL from `imageCache` when it is available.
- [x] When an allowed remote artwork URL is not cached, redirect `/art/...` to the original remote URL instead of returning a 503.
- [x] Register manually added URLs in the server's runtime artwork allowlist when they are saved, so refreshes work before the next editor restart.
- [x] Preserve the existing next-start preload/cache behavior; a manually added URL becomes part of the ordinary configured artwork set after it is written to `labels.json`.

## Layout guardrail

- [x] Limit the metadata-band height in the editor to the remaining physical label height (`face.heightInches - metadataBand.topInches`; currently 1.5 in).
- [x] Enforce the same calculated maximum in the server-side update validation.
- [x] Add a focused regression test for the metadata-band bound.

## Verification

- [x] Manually add a reachable non-Marvel cover URL, crop it, save it, and verify the URL remains in `art.options` after a refresh and restart.
- [x] Verify a manually added Marvel URL is saved as a valid `clean.jpg` URL.
- [x] Verify an allowed cache miss renders via redirect and a cached URL continues to be served locally.
- [x] Run `npm run check` and `npm run build`.

## Notes

- 2026-07-31: Manual URL additions preserve a previously selected image even when that label had no existing `art.options` list; the prior image is added before the new URL.
- 2026-07-31: Marvel URL normalization and cached/uncached artwork delivery are covered by focused automated tests. The live editor also completed a configuration-endpoint smoke test with all 115 labels.
- 2026-07-31: A temporary-workspace integration test now exercises the real editor HTTP flow with a local reachable non-Marvel image server: add/save/crop, refresh redirect, restart, and cached response. It leaves the actual catalog unchanged.
