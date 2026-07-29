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
   usable cover than Marvel. The goal is one usable candidate for **each issue**
   in the label's configured run, not merely a small shortlist.
5. If neither primary source yields a usable image, search for another stable,
   reviewable source. Record that exception in the research notes so later
   passes know what worked.
6. Add the chosen candidate URLs to that label's `art.options` list in
   `config/labels.json`, preserving issue order where it is known. Keep the
   current selected `art.asset` in the list.
7. Start the editor, compare the candidates, and choose/crop the winner. The
   local server caches every configured candidate at startup.
8. **Only when the candidate URLs have been added to `config/labels.json`,
   check off the item in this document.** Add a brief note below if a source,
   title, or scope decision taught us something reusable.

Existing candidates do not automatically make an item complete: they still
need the same review and confirmation process.

## Research notes

- `fantastic-four-003` is in progress. The editor-cache-validated candidate
  set currently covers #2, #4, #5 (Doctor Doom's first appearance), #8, #9,
  #12 (Hulk encounter), and #13 (Red Ghost/Watcher). The #1 source was
  identified but its current direct image URL failed the editor-cache check,
  so it was not added. The item remains
  unchecked until the rest of #1–25 has received the same source review.
- Marvel's public issue pages identify the relevant issue and cover, but their
  CDN can reject direct automated requests. Treat the official issue page as
  the source of record and confirm the image in the local editor cache before
  relying on a direct image URL.

### Fantastic Four (1961) #1–25: concrete findings

- The reliable discovery query is `site:marvel.com/comics/issue "Fantastic
  Four (1961) #<issue>"`. For the first twelve issues it found these official
  issue IDs: #1 `12894`, #2 `13005`, #3 `13116`, #4 `13227`, #5 `13255`, #6
  `13266`, #7 `13277`, #8 `13288`, #9 `13299`, #10 `12895`, #11 `12906`, and
  #12 `12917`. The IDs are not sequential, so discover each page rather than
  extrapolating an ID or URL slug.
- On a successful official issue-page response, the main cover is exposed as a
  `cdn.marvel.com/.../clean.jpg` image link. For example, the #2 page exposes
  `https://cdn.marvel.com/u/prod/marvel/i/mg/3/d0/536d72ee76127/clean.jpg`.
  It successfully preloaded in the local editor and is now a candidate.
- Official issue pages can be found by search and sometimes opened in the
  browser, but direct command-line requests to Marvel returned CloudFront 403
  responses during this pass. Do not treat a command-line 403 as evidence that
  the issue page or cover is absent.
- A later full harvest showed that the 403 was request-client-specific, not a
  general page-rate limit. The Node collector successfully fetched all 1,025
  available official issue pages in one serialized run at a 500 ms cadence,
  with no 403 or 429 responses. It sent ordinary browser-like `Accept`,
  `Accept-Language`, and `User-Agent` headers; PowerShell's
  `Invoke-WebRequest` still received CloudFront 403 for the same page.
- The page HTML exposes the primary cover as a
  `cdn.marvel.com/.../portrait_uncanny.webp` URL. Replacing only that final
  filename with `clean.jpg` preserves the exact CDN asset path and yielded a
  clean counterpart for every harvested page. The page preview uses WebP, but
  the clean CDN rendition is JPEG. This is an observed page-asset relationship,
  not an ID or slug inference.
- Use `npm run harvest:marvel-covers` for the repeatable cover pass. It is
  deliberately serialized, records every success in
  `docs/MARVEL-COVER-URLS.json`, skips those successes on later runs, and
  stops after three consecutive 403 or 429 responses. Do not parallelize the
  page fetches or lower its 500 ms minimum delay without a fresh, controlled
  rate-limit check.
- Marvel Database's `Special:FilePath` URLs and MediaWiki API were blocked by
  a Cloudflare challenge in command-line requests. Direct
  `static.wikia.nocookie.net` image URLs are more useful once their exact path
  has been discovered.
- The direct Marvel Database #5 URL
  `https://static.wikia.nocookie.net/marveldatabase/images/8/82/Fantastic_Four_Vol_1_5.jpg`
  successfully preloaded in the local editor and was visually checked. It is a
  strong Doom-centered cover candidate.
- A legacy #1 URL using `Fantastic_Four_VOL_1_1.png` did **not** preload in the
  local editor, even though search results identified it. Do not add a
  candidate until the editor cache has confirmed it; keep failed discoveries in
  research notes rather than `art.options`.
- Fandom can temporarily rate-limit repeated page lookups with HTTP 402, while
  individual `static.wikia.nocookie.net` image URLs may remain fetchable. Stop
  the page-probing run when that happens and resume later; do not infer image
  paths from issue numbers or mark the label complete.
- Fandom's predictable `Special:FilePath/<title>.jpg` redirect is not a viable
  fallback in the editor server during the current rate-limit period: the
  attempted Fantastic Four #10 redirect did not enter the cache. Keep only
  discovered direct static-image URLs.
- The #4, #9, and #12 Marvel Database URLs were each confirmed by the editor's
  startup cache. Keep using that cache as the final acceptance check, not
  merely a browser response.
- A purported #8 official legacy CDN URL was an Avengers #4 cover and was
  removed. The separately discovered Marvel Database #8 URL was visually
  verified and cached successfully. Cache validation confirms retrieval, not
  issue identity, so visually verify every cover before checking it off.

## What we have learned

- Official Marvel issue pages are the preferred discovery route for cover
  images because they usually provide the larger usable cover.
- Marvel Database/Fandom should still be compared by image dimensions; it can
  occasionally provide a larger usable cover than the official image.
- Candidate URLs are deliberately compact strings in `art.options`; store one
  usable candidate per issue in a bounded run. Per-option crops are temporary
  editor state, and saving persists only the selected asset and its crop.
- The local editor preloads configured remote candidates into its ignored disk
  cache. A failed remote URL should be replaced rather than relied on.
- Official-page cover harvesting is practical with the resumable Node
  collector. Treat 500 ms as the currently demonstrated safe serialized
  cadence, not a permanent Marvel service guarantee; keep the stop-on-block
  behavior intact.

## Active bounded Marvel checklist

### Fantastic Four

- [ ] `fantastic-four-003` — Ready: Fantastic Four #1–25
  - [ ] #1
  - [x] #2
  - [ ] #3
  - [x] #4
  - [x] #5
  - [ ] #6
  - [ ] #7
  - [x] #8
  - [x] #9
  - [ ] #10
  - [ ] #11
  - [x] #12
  - [x] #13
  - [ ] #14
  - [ ] #15
  - [ ] #16
  - [ ] #17
  - [ ] #18
  - [ ] #19
  - [ ] #20
  - [ ] #21
  - [ ] #22
  - [ ] #23
  - [ ] #24
  - [ ] #25
- [ ] `fantastic-four-004` — Ready: Fantastic Four #26–50
  - [ ] #26
  - [ ] #27
  - [ ] #28
  - [ ] #29
  - [ ] #30
  - [ ] #31
  - [ ] #32
  - [ ] #33
  - [ ] #34
  - [ ] #35
  - [ ] #36
  - [ ] #37
  - [ ] #38
  - [ ] #39
  - [ ] #40
  - [ ] #41
  - [ ] #42
  - [ ] #43
  - [ ] #44
  - [ ] #45
  - [ ] #46
  - [ ] #47
  - [ ] #48
  - [ ] #49
  - [ ] #50
- [ ] `fantastic-four-005` — Ready: Fantastic Four #51–75
  - [ ] #51
  - [ ] #52
  - [ ] #53
  - [ ] #54
  - [ ] #55
  - [ ] #56
  - [ ] #57
  - [ ] #58
  - [ ] #59
  - [ ] #60
  - [ ] #61
  - [ ] #62
  - [ ] #63
  - [ ] #64
  - [ ] #65
  - [ ] #66
  - [ ] #67
  - [ ] #68
  - [ ] #69
  - [ ] #70
  - [ ] #71
  - [ ] #72
  - [ ] #73
  - [ ] #74
  - [ ] #75
- [ ] `fantastic-four-035` — Ready: Fantastic Four #76–100
  - [ ] #76
  - [ ] #77
  - [ ] #78
  - [ ] #79
  - [ ] #80
  - [ ] #81
  - [ ] #82
  - [ ] #83
  - [ ] #84
  - [ ] #85
  - [ ] #86
  - [ ] #87
  - [ ] #88
  - [ ] #89
  - [ ] #90
  - [ ] #91
  - [ ] #92
  - [ ] #93
  - [ ] #94
  - [ ] #95
  - [ ] #96
  - [ ] #97
  - [ ] #98
  - [ ] #99
  - [ ] #100
- [ ] `fantastic-four-036` — Ready: Fantastic Four #101–125
  - [ ] #101
  - [ ] #102
  - [ ] #103
  - [ ] #104
  - [ ] #105
  - [ ] #106
  - [ ] #107
  - [ ] #108
  - [ ] #109
  - [ ] #110
  - [ ] #111
  - [ ] #112
  - [ ] #113
  - [ ] #114
  - [ ] #115
  - [ ] #116
  - [ ] #117
  - [ ] #118
  - [ ] #119
  - [ ] #120
  - [ ] #121
  - [ ] #122
  - [ ] #123
  - [ ] #124
  - [ ] #125
- [ ] `fantastic-four-037` — Ready: Fantastic Four #126–150
  - [ ] #126
  - [ ] #127
  - [ ] #128
  - [ ] #129
  - [ ] #130
  - [ ] #131
  - [ ] #132
  - [ ] #133
  - [ ] #134
  - [ ] #135
  - [ ] #136
  - [ ] #137
  - [ ] #138
  - [ ] #139
  - [ ] #140
  - [ ] #141
  - [ ] #142
  - [ ] #143
  - [ ] #144
  - [ ] #145
  - [ ] #146
  - [ ] #147
  - [ ] #148
  - [ ] #149
  - [ ] #150
- [ ] `fantastic-four-038` — Ready: Fantastic Four #151–175
  - [ ] #151
  - [ ] #152
  - [ ] #153
  - [ ] #154
  - [ ] #155
  - [ ] #156
  - [ ] #157
  - [ ] #158
  - [ ] #159
  - [ ] #160
  - [ ] #161
  - [ ] #162
  - [ ] #163
  - [ ] #164
  - [ ] #165
  - [ ] #166
  - [ ] #167
  - [ ] #168
  - [ ] #169
  - [ ] #170
  - [ ] #171
  - [ ] #172
  - [ ] #173
  - [ ] #174
  - [ ] #175
- [ ] `fantastic-four-039` — Ready: Fantastic Four #176–200
  - [ ] #176
  - [ ] #177
  - [ ] #178
  - [ ] #179
  - [ ] #180
  - [ ] #181
  - [ ] #182
  - [ ] #183
  - [ ] #184
  - [ ] #185
  - [ ] #186
  - [ ] #187
  - [ ] #188
  - [ ] #189
  - [ ] #190
  - [ ] #191
  - [ ] #192
  - [ ] #193
  - [ ] #194
  - [ ] #195
  - [ ] #196
  - [ ] #197
  - [ ] #198
  - [ ] #199
  - [ ] #200
- [ ] `fantastic-four-006` — Ready: Fantastic Four #201–225
  - [ ] #201
  - [ ] #202
  - [ ] #203
  - [ ] #204
  - [ ] #205
  - [ ] #206
  - [ ] #207
  - [ ] #208
  - [ ] #209
  - [ ] #210
  - [ ] #211
  - [ ] #212
  - [ ] #213
  - [ ] #214
  - [ ] #215
  - [ ] #216
  - [ ] #217
  - [ ] #218
  - [ ] #219
  - [ ] #220
  - [ ] #221
  - [ ] #222
  - [ ] #223
  - [ ] #224
  - [ ] #225
- [ ] `fantastic-four-007` — Ready: Fantastic Four #226–250
  - [ ] #226
  - [ ] #227
  - [ ] #228
  - [ ] #229
  - [ ] #230
  - [ ] #231
  - [ ] #232
  - [ ] #233
  - [ ] #234
  - [ ] #235
  - [ ] #236
  - [ ] #237
  - [ ] #238
  - [ ] #239
  - [ ] #240
  - [ ] #241
  - [ ] #242
  - [ ] #243
  - [ ] #244
  - [ ] #245
  - [ ] #246
  - [ ] #247
  - [ ] #248
  - [ ] #249
  - [ ] #250
- [ ] `fantastic-four-008` — Ready: Fantastic Four #251–275
  - [ ] #251
  - [ ] #252
  - [ ] #253
  - [ ] #254
  - [ ] #255
  - [ ] #256
  - [ ] #257
  - [ ] #258
  - [ ] #259
  - [ ] #260
  - [ ] #261
  - [ ] #262
  - [ ] #263
  - [ ] #264
  - [ ] #265
  - [ ] #266
  - [ ] #267
  - [ ] #268
  - [ ] #269
  - [ ] #270
  - [ ] #271
  - [ ] #272
  - [ ] #273
  - [ ] #274
  - [ ] #275
- [ ] `fantastic-four-009` — Ready: Fantastic Four #276–300
  - [ ] #276
  - [ ] #277
  - [ ] #278
  - [ ] #279
  - [ ] #280
  - [ ] #281
  - [ ] #282
  - [ ] #283
  - [ ] #284
  - [ ] #285
  - [ ] #286
  - [ ] #287
  - [ ] #288
  - [ ] #289
  - [ ] #290
  - [ ] #291
  - [ ] #292
  - [ ] #293
  - [ ] #294
  - [ ] #295
  - [ ] #296
  - [ ] #297
  - [ ] #298
  - [ ] #299
  - [ ] #300
- [ ] `fantastic-four-010` — Ready: Fantastic Four #301–325
  - [ ] #301
  - [ ] #302
  - [ ] #303
  - [ ] #304
  - [ ] #305
  - [ ] #306
  - [ ] #307
  - [ ] #308
  - [ ] #309
  - [ ] #310
  - [ ] #311
  - [ ] #312
  - [ ] #313
  - [ ] #314
  - [ ] #315
  - [ ] #316
  - [ ] #317
  - [ ] #318
  - [ ] #319
  - [ ] #320
  - [ ] #321
  - [ ] #322
  - [ ] #323
  - [ ] #324
  - [ ] #325
- [ ] `fantastic-four-011` — Ready: Fantastic Four #326–350
  - [ ] #326
  - [ ] #327
  - [ ] #328
  - [ ] #329
  - [ ] #330
  - [ ] #331
  - [ ] #332
  - [ ] #333
  - [ ] #334
  - [ ] #335
  - [ ] #336
  - [ ] #337
  - [ ] #338
  - [ ] #339
  - [ ] #340
  - [ ] #341
  - [ ] #342
  - [ ] #343
  - [ ] #344
  - [ ] #345
  - [ ] #346
  - [ ] #347
  - [ ] #348
  - [ ] #349
  - [ ] #350
- [ ] `fantastic-four-012` — Ready: Fantastic Four #351–375
  - [ ] #351
  - [ ] #352
  - [ ] #353
  - [ ] #354
  - [ ] #355
  - [ ] #356
  - [ ] #357
  - [ ] #358
  - [ ] #359
  - [ ] #360
  - [ ] #361
  - [ ] #362
  - [ ] #363
  - [ ] #364
  - [ ] #365
  - [ ] #366
  - [ ] #367
  - [ ] #368
  - [ ] #369
  - [ ] #370
  - [ ] #371
  - [ ] #372
  - [ ] #373
  - [ ] #374
  - [ ] #375
- [ ] `fantastic-four-013` — Ready: Fantastic Four #376–400
  - [ ] #376
  - [ ] #377
  - [ ] #378
  - [ ] #379
  - [ ] #380
  - [ ] #381
  - [ ] #382
  - [ ] #383
  - [ ] #384
  - [ ] #385
  - [ ] #386
  - [ ] #387
  - [ ] #388
  - [ ] #389
  - [ ] #390
  - [ ] #391
  - [ ] #392
  - [ ] #393
  - [ ] #394
  - [ ] #395
  - [ ] #396
  - [ ] #397
  - [ ] #398
  - [ ] #399
  - [ ] #400
- [ ] `fantastic-four-015` — Ready: 1997 series #1–25
  - [ ] #1
  - [ ] #2
  - [ ] #3
  - [ ] #4
  - [ ] #5
  - [ ] #6
  - [ ] #7
  - [ ] #8
  - [ ] #9
  - [ ] #10
  - [ ] #11
  - [ ] #12
  - [ ] #13
  - [ ] #14
  - [ ] #15
  - [ ] #16
  - [ ] #17
  - [ ] #18
  - [ ] #19
  - [ ] #20
  - [ ] #21
  - [ ] #22
  - [ ] #23
  - [ ] #24
  - [ ] #25
- [ ] `fantastic-four-016` — Ready: 1997 series #26–50
  - [ ] #26
  - [ ] #27
  - [ ] #28
  - [ ] #29
  - [ ] #30
  - [ ] #31
  - [ ] #32
  - [ ] #33
  - [ ] #34
  - [ ] #35
  - [ ] #36
  - [ ] #37
  - [ ] #38
  - [ ] #39
  - [ ] #40
  - [ ] #41
  - [ ] #42
  - [ ] #43
  - [ ] #44
  - [ ] #45
  - [ ] #46
  - [ ] #47
  - [ ] #48
  - [ ] #49
  - [ ] #50
- [ ] `fantastic-four-042` — Ready: 1997 series #51–70
  - [ ] #51
  - [ ] #52
  - [ ] #53
  - [ ] #54
  - [ ] #55
  - [ ] #56
  - [ ] #57
  - [ ] #58
  - [ ] #59
  - [ ] #60
  - [ ] #61
  - [ ] #62
  - [ ] #63
  - [ ] #64
  - [ ] #65
  - [ ] #66
  - [ ] #67
  - [ ] #68
  - [ ] #69
  - [ ] #70
- [ ] `fantastic-four-017` — Ready: legacy #500–525
  - [ ] #500
  - [ ] #501
  - [ ] #502
  - [ ] #503
  - [ ] #504
  - [ ] #505
  - [ ] #506
  - [ ] #507
  - [ ] #508
  - [ ] #509
  - [ ] #510
  - [ ] #511
  - [ ] #512
  - [ ] #513
  - [ ] #514
  - [ ] #515
  - [ ] #516
  - [ ] #517
  - [ ] #518
  - [ ] #519
  - [ ] #520
  - [ ] #521
  - [ ] #522
  - [ ] #523
  - [ ] #524
  - [ ] #525
- [ ] `fantastic-four-018` — Ready: legacy #526–550
  - [ ] #526
  - [ ] #527
  - [ ] #528
  - [ ] #529
  - [ ] #530
  - [ ] #531
  - [ ] #532
  - [ ] #533
  - [ ] #534
  - [ ] #535
  - [ ] #536
  - [ ] #537
  - [ ] #538
  - [ ] #539
  - [ ] #540
  - [ ] #541
  - [ ] #542
  - [ ] #543
  - [ ] #544
  - [ ] #545
  - [ ] #546
  - [ ] #547
  - [ ] #548
  - [ ] #549
  - [ ] #550
- [ ] `fantastic-four-043` — Ready: legacy #551–575
  - [ ] #551
  - [ ] #552
  - [ ] #553
  - [ ] #554
  - [ ] #555
  - [ ] #556
  - [ ] #557
  - [ ] #558
  - [ ] #559
  - [ ] #560
  - [ ] #561
  - [ ] #562
  - [ ] #563
  - [ ] #564
  - [ ] #565
  - [ ] #566
  - [ ] #567
  - [ ] #568
  - [ ] #569
  - [ ] #570
  - [ ] #571
  - [ ] #572
  - [ ] #573
  - [ ] #574
  - [ ] #575
- [ ] `fantastic-four-046` — Ready: 2018 series #7–28
  - [ ] #7
  - [ ] #8
  - [ ] #9
  - [ ] #10
  - [ ] #11
  - [ ] #12
  - [ ] #13
  - [ ] #14
  - [ ] #15
  - [ ] #16
  - [ ] #17
  - [ ] #18
  - [ ] #19
  - [ ] #20
  - [ ] #21
  - [ ] #22
  - [ ] #23
  - [ ] #24
  - [ ] #25
  - [ ] #26
  - [ ] #27
  - [ ] #28
- [ ] `fantastic-four-047` — Ready: 2018 series #29–48
  - [ ] #29
  - [ ] #30
  - [ ] #31
  - [ ] #32
  - [ ] #33
  - [ ] #34
  - [ ] #35
  - [ ] #36
  - [ ] #37
  - [ ] #38
  - [ ] #39
  - [ ] #40
  - [ ] #41
  - [ ] #42
  - [ ] #43
  - [ ] #44
  - [ ] #45
  - [ ] #46
  - [ ] #47
  - [ ] #48
- [ ] `fantastic-four-048` — Ready: 2022 series #1–13
  - [ ] #1
  - [ ] #2
  - [ ] #3
  - [ ] #4
  - [ ] #5
  - [ ] #6
  - [ ] #7
  - [ ] #8
  - [ ] #9
  - [ ] #10
  - [ ] #11
  - [ ] #12
  - [ ] #13
- [ ] `fantastic-four-049` — Ready: 2022 series #14–33
  - [ ] #14
  - [ ] #15
  - [ ] #16
  - [ ] #17
  - [ ] #18
  - [ ] #19
  - [ ] #20
  - [ ] #21
  - [ ] #22
  - [ ] #23
  - [ ] #24
  - [ ] #25
  - [ ] #26
  - [ ] #27
  - [ ] #28
  - [ ] #29
  - [ ] #30
  - [ ] #31
  - [ ] #32
  - [ ] #33
- [ ] `fantastic-four-050` — Ready: 2025 series #1–18
  - [ ] #1
  - [ ] #2
  - [ ] #3
  - [ ] #4
  - [ ] #5
  - [ ] #6
  - [ ] #7
  - [ ] #8
  - [ ] #9
  - [ ] #10
  - [ ] #11
  - [ ] #12
  - [ ] #13
  - [ ] #14
  - [ ] #15
  - [ ] #16
  - [ ] #17
  - [ ] #18

### X-family

- [ ] `new-mutants-001` — Ready: New Mutants #1–25
  - [ ] #1
  - [ ] #2
  - [ ] #3
  - [ ] #4
  - [ ] #5
  - [ ] #6
  - [ ] #7
  - [ ] #8
  - [ ] #9
  - [ ] #10
  - [ ] #11
  - [ ] #12
  - [ ] #13
  - [ ] #14
  - [ ] #15
  - [ ] #16
  - [ ] #17
  - [ ] #18
  - [ ] #19
  - [ ] #20
  - [ ] #21
  - [ ] #22
  - [ ] #23
  - [ ] #24
  - [ ] #25
- [ ] `new-mutants-002` — Ready: New Mutants #26–50
  - [ ] #26
  - [ ] #27
  - [ ] #28
  - [ ] #29
  - [ ] #30
  - [ ] #31
  - [ ] #32
  - [ ] #33
  - [ ] #34
  - [ ] #35
  - [ ] #36
  - [ ] #37
  - [ ] #38
  - [ ] #39
  - [ ] #40
  - [ ] #41
  - [ ] #42
  - [ ] #43
  - [ ] #44
  - [ ] #45
  - [ ] #46
  - [ ] #47
  - [ ] #48
  - [ ] #49
  - [ ] #50
- [ ] `new-mutants-003` — Ready: New Mutants #51–75
  - [ ] #51
  - [ ] #52
  - [ ] #53
  - [ ] #54
  - [ ] #55
  - [ ] #56
  - [ ] #57
  - [ ] #58
  - [ ] #59
  - [ ] #60
  - [ ] #61
  - [ ] #62
  - [ ] #63
  - [ ] #64
  - [ ] #65
  - [ ] #66
  - [ ] #67
  - [ ] #68
  - [ ] #69
  - [ ] #70
  - [ ] #71
  - [ ] #72
  - [ ] #73
  - [ ] #74
  - [ ] #75
- [ ] `new-mutants-004` — Ready: New Mutants #76–100
  - [ ] #76
  - [ ] #77
  - [ ] #78
  - [ ] #79
  - [ ] #80
  - [ ] #81
  - [ ] #82
  - [ ] #83
  - [ ] #84
  - [ ] #85
  - [ ] #86
  - [ ] #87
  - [ ] #88
  - [ ] #89
  - [ ] #90
  - [ ] #91
  - [ ] #92
  - [ ] #93
  - [ ] #94
  - [ ] #95
  - [ ] #96
  - [ ] #97
  - [ ] #98
  - [ ] #99
  - [ ] #100
- [ ] `x-men-001` — Ready: Uncanny X-Men #126–150
  - [ ] #126
  - [ ] #127
  - [ ] #128
  - [ ] #129
  - [ ] #130
  - [ ] #131
  - [ ] #132
  - [ ] #133
  - [ ] #134
  - [ ] #135
  - [ ] #136
  - [ ] #137
  - [ ] #138
  - [ ] #139
  - [ ] #140
  - [ ] #141
  - [ ] #142
  - [ ] #143
  - [ ] #144
  - [ ] #145
  - [ ] #146
  - [ ] #147
  - [ ] #148
  - [ ] #149
  - [ ] #150
- [ ] `x-men-002` — Ready: Uncanny X-Men #151–175
  - [ ] #151
  - [ ] #152
  - [ ] #153
  - [ ] #154
  - [ ] #155
  - [ ] #156
  - [ ] #157
  - [ ] #158
  - [ ] #159
  - [ ] #160
  - [ ] #161
  - [ ] #162
  - [ ] #163
  - [ ] #164
  - [ ] #165
  - [ ] #166
  - [ ] #167
  - [ ] #168
  - [ ] #169
  - [ ] #170
  - [ ] #171
  - [ ] #172
  - [ ] #173
  - [ ] #174
  - [ ] #175
- [ ] `x-men-003` — Ready: Uncanny X-Men #176–200
  - [ ] #176
  - [ ] #177
  - [ ] #178
  - [ ] #179
  - [ ] #180
  - [ ] #181
  - [ ] #182
  - [ ] #183
  - [ ] #184
  - [ ] #185
  - [ ] #186
  - [ ] #187
  - [ ] #188
  - [ ] #189
  - [ ] #190
  - [ ] #191
  - [ ] #192
  - [ ] #193
  - [ ] #194
  - [ ] #195
  - [ ] #196
  - [ ] #197
  - [ ] #198
  - [ ] #199
  - [ ] #200
- [ ] `x-men-004` — Ready: Uncanny X-Men #201–225
  - [ ] #201
  - [ ] #202
  - [ ] #203
  - [ ] #204
  - [ ] #205
  - [ ] #206
  - [ ] #207
  - [ ] #208
  - [ ] #209
  - [ ] #210
  - [ ] #211
  - [ ] #212
  - [ ] #213
  - [ ] #214
  - [ ] #215
  - [ ] #216
  - [ ] #217
  - [ ] #218
  - [ ] #219
  - [ ] #220
  - [ ] #221
  - [ ] #222
  - [ ] #223
  - [ ] #224
  - [ ] #225
- [ ] `x-men-005` — Ready: Uncanny X-Men #226–250
  - [ ] #226
  - [ ] #227
  - [ ] #228
  - [ ] #229
  - [ ] #230
  - [ ] #231
  - [ ] #232
  - [ ] #233
  - [ ] #234
  - [ ] #235
  - [ ] #236
  - [ ] #237
  - [ ] #238
  - [ ] #239
  - [ ] #240
  - [ ] #241
  - [ ] #242
  - [ ] #243
  - [ ] #244
  - [ ] #245
  - [ ] #246
  - [ ] #247
  - [ ] #248
  - [ ] #249
  - [ ] #250
- [ ] `x-men-006` — Ready: Uncanny X-Men #251–275
  - [ ] #251
  - [ ] #252
  - [ ] #253
  - [ ] #254
  - [ ] #255
  - [ ] #256
  - [ ] #257
  - [ ] #258
  - [ ] #259
  - [ ] #260
  - [ ] #261
  - [ ] #262
  - [ ] #263
  - [ ] #264
  - [ ] #265
  - [ ] #266
  - [ ] #267
  - [ ] #268
  - [ ] #269
  - [ ] #270
  - [ ] #271
  - [ ] #272
  - [ ] #273
  - [ ] #274
  - [ ] #275
- [ ] `x-men-007` — Ready: Uncanny X-Men #276–300
  - [ ] #276
  - [ ] #277
  - [ ] #278
  - [ ] #279
  - [ ] #280
  - [ ] #281
  - [ ] #282
  - [ ] #283
  - [ ] #284
  - [ ] #285
  - [ ] #286
  - [ ] #287
  - [ ] #288
  - [ ] #289
  - [ ] #290
  - [ ] #291
  - [ ] #292
  - [ ] #293
  - [ ] #294
  - [ ] #295
  - [ ] #296
  - [ ] #297
  - [ ] #298
  - [ ] #299
  - [ ] #300
- [ ] `excalibur-001` — Ready: Excalibur #1–25
  - [ ] #1
  - [ ] #2
  - [ ] #3
  - [ ] #4
  - [ ] #5
  - [ ] #6
  - [ ] #7
  - [ ] #8
  - [ ] #9
  - [ ] #10
  - [ ] #11
  - [ ] #12
  - [ ] #13
  - [ ] #14
  - [ ] #15
  - [ ] #16
  - [ ] #17
  - [ ] #18
  - [ ] #19
  - [ ] #20
  - [ ] #21
  - [ ] #22
  - [ ] #23
  - [ ] #24
  - [ ] #25
- [ ] `excalibur-002` — Ready: Excalibur #26–50
  - [ ] #26
  - [ ] #27
  - [ ] #28
  - [ ] #29
  - [ ] #30
  - [ ] #31
  - [ ] #32
  - [ ] #33
  - [ ] #34
  - [ ] #35
  - [ ] #36
  - [ ] #37
  - [ ] #38
  - [ ] #39
  - [ ] #40
  - [ ] #41
  - [ ] #42
  - [ ] #43
  - [ ] #44
  - [ ] #45
  - [ ] #46
  - [ ] #47
  - [ ] #48
  - [ ] #49
  - [ ] #50
- [ ] `excalibur-003` — Ready: Excalibur #51–75
  - [ ] #51
  - [ ] #52
  - [ ] #53
  - [ ] #54
  - [ ] #55
  - [ ] #56
  - [ ] #57
  - [ ] #58
  - [ ] #59
  - [ ] #60
  - [ ] #61
  - [ ] #62
  - [ ] #63
  - [ ] #64
  - [ ] #65
  - [ ] #66
  - [ ] #67
  - [ ] #68
  - [ ] #69
  - [ ] #70
  - [ ] #71
  - [ ] #72
  - [ ] #73
  - [ ] #74
  - [ ] #75

### Marvel specials

- [ ] `earth-x-001` — Ready: Earth X #0–12
  - [ ] #0
  - [ ] #1
  - [ ] #2
  - [ ] #3
  - [ ] #4
  - [ ] #5
  - [ ] #6
  - [ ] #7
  - [ ] #8
  - [ ] #9
  - [ ] #10
  - [ ] #11
  - [ ] #12
- [ ] `ultimate-spider-man-001` — Ready: Ultimate Spider-Man #1–24
  - [ ] #1
  - [ ] #2
  - [ ] #3
  - [ ] #4
  - [ ] #5
  - [ ] #6
  - [ ] #7
  - [ ] #8
  - [ ] #9
  - [ ] #10
  - [ ] #11
  - [ ] #12
  - [ ] #13
  - [ ] #14
  - [ ] #15
  - [ ] #16
  - [ ] #17
  - [ ] #18
  - [ ] #19
  - [ ] #20
  - [ ] #21
  - [ ] #22
  - [ ] #23
  - [ ] #24
- [ ] `ultimates-001` — Ready: Ultimates #1–24
  - [ ] #1
  - [ ] #2
  - [ ] #3
  - [ ] #4
  - [ ] #5
  - [ ] #6
  - [ ] #7
  - [ ] #8
  - [ ] #9
  - [ ] #10
  - [ ] #11
  - [ ] #12
  - [ ] #13
  - [ ] #14
  - [ ] #15
  - [ ] #16
  - [ ] #17
  - [ ] #18
  - [ ] #19
  - [ ] #20
  - [ ] #21
  - [ ] #22
  - [ ] #23
  - [ ] #24

### Marvel licensed titles

- [ ] `indiana-jones-001` — Ready: The Further Adventures of Indiana Jones #1–17
  - [ ] #1
  - [ ] #2
  - [ ] #3
  - [ ] #4
  - [ ] #5
  - [ ] #6
  - [ ] #7
  - [ ] #8
  - [ ] #9
  - [ ] #10
  - [ ] #11
  - [ ] #12
  - [ ] #13
  - [ ] #14
  - [ ] #15
  - [ ] #16
  - [ ] #17
- [ ] `indiana-jones-002` — Ready: The Further Adventures of Indiana Jones #18–34
  - [ ] #18
  - [ ] #19
  - [ ] #20
  - [ ] #21
  - [ ] #22
  - [ ] #23
  - [ ] #24
  - [ ] #25
  - [ ] #26
  - [ ] #27
  - [ ] #28
  - [ ] #29
  - [ ] #30
  - [ ] #31
  - [ ] #32
  - [ ] #33
  - [ ] #34

## Later publisher/source investigations

Do not add these to the active Marvel queue yet. After the Marvel process has
produced reliable candidates and source notes, investigate whether each
publisher has a dependable equivalent of the official-Marvel-page-first
workflow. Add a new checklist section only when the source approach is clear.

- **DC:** `teen-titans-go-001`, `teen-titans-go-002`, `young-justice-001`,
  `young-justice-002`, and `young-justice-003`.
