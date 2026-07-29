# Marvel Browser Harvest Queue

## Batch issue-page discovery

The handoff queue can also be resolved in batches without scraping a search
engine's HTML. By default, the collector uses the free Marvel Metadata API's
series index, which records canonical `marvel.com/comics/issue/...` URLs; it
writes a restartable review inventory under ignored `artwork-cache/`. It does
not alter this queue or select cover art.

```powershell
npm run harvest:marvel-pages -- --label fantastic-four-003 --limit 25
```

Review `found` URLs before copying them back into **Official Marvel page URL**.
`not-found` and `error` entries remain deliberate human-review cases. The
optional `--provider serper` route uses the exact Google discovery query in the
queue when a `SERPER_API_KEY` is available. A later run resumes the previous
inventory; use `--refresh` to redo previously found entries.

## Batch cover discovery

Once [MARVEL-ISSUE-PAGES.json](MARVEL-ISSUE-PAGES.json) has entries with
`status: "found"`, collect their page-exposed main covers with:

```powershell
npm run harvest:marvel-covers
```

The collector makes one browser-headered Node request at a time, defaults to a
500 ms delay, persists successes in `MARVEL-COVER-URLS.json`, and skips them on
later runs. It records the source `portrait_uncanny` URL plus its same-path
`clean` counterpart while preserving the extension. It stops after three
consecutive 403/429 responses; do not replace it with a parallel scraper.

This is the full browser-assisted handoff list for every active, bounded Marvel
issue in `ARTWORK-RESEARCH.md`. It intentionally does **not** invent Marvel
issue-page IDs: where the exact official page is already known, it is linked;
otherwise use the one-click issue-specific discovery search, then paste the
actual Marvel page URL below it.

## Capture workflow

1. Open the official Marvel page or its discovery search.
2. Open the main cover in a new tab and paste the copied URL under **Direct
   cover URL**. If a Marvel CDN URL ends in `portrait_uncanny.jpg`, also try a
   copy ending in `clean.jpg`; preserve the rest of the URL exactly.
3. Leave the checkbox alone. Codex will cache-test, visually confirm, add the
   candidate to `config/labels.json`, and then check off the durable research
   checklist.

A working image URL is not proof of the correct issue—please keep the page
open long enough to confirm the cover and issue number.

## Fantastic Four

### `fantastic-four-003` — Fantastic Four #1-25

- [ ] #1 — [official issue page](https://www.marvel.com/comics/issue/12894/fantastic_four_1961_1)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #2 — [official issue page](https://www.marvel.com/comics/issue/13005/)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #3 — [official issue page](https://www.marvel.com/comics/issue/13116/fantastic_four_1961_3)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #4 — [official issue page](https://www.marvel.com/comics/issue/13227/fantastic_four_1961_4)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #5 — [official issue page](https://www.marvel.com/comics/issue/13255/fantastic_four_1961_5)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #6 — [official issue page](https://www.marvel.com/comics/issue/13266/fantastic_four_1961_6)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #7 — [official issue page](https://www.marvel.com/comics/issue/13277/fantastic_four_1961_7)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #8 — [official issue page](https://www.marvel.com/comics/issue/13288/fantastic_four_1961_8)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #9 — [official issue page](https://www.marvel.com/comics/issue/13299/fantastic_four_1961_9)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #10 — [official issue page](https://www.marvel.com/comics/issue/12895/fantastic_four_1961_10)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #11 — [official issue page](https://www.marvel.com/comics/issue/12906/fantastic_four_1961_11)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #12 — [official issue page](https://www.marvel.com/comics/issue/12917/read)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #13 — [official issue page](https://www.marvel.com/comics/issue/12928/fantastic_four_1961_13)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #14 — [official issue page](https://www.marvel.com/comics/issue/12939/fantastic_four_1961_14)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #15 — [official issue page](https://www.marvel.com/comics/issue/12950/fantastic_four_1961_15)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #16 — [official issue page](https://www.marvel.com/comics/issue/12961/fantastic_four_1961_16)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #17 — [official issue page](https://www.marvel.com/comics/issue/12972/fantastic_four_1961_17)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #18 — [official issue page](https://www.marvel.com/comics/issue/12983/fantastic_four_1961_18)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #19 — [official issue page](https://www.marvel.com/comics/issue/12994/fantastic_four_1961_19)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #20 — [official issue page](https://www.marvel.com/comics/issue/13006/)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #21 — [official issue page](https://www.marvel.com/comics/issue/13017/fantastic_four_1961_21)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #22 — [official issue page](https://www.marvel.com/comics/issue/13028/fantastic_four_1961_22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #23 — [official issue page](https://www.marvel.com/comics/issue/13039/fantastic_four_1961_23)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #24 — [official issue page](https://www.marvel.com/comics/issue/13050/fantastic_four_1961_24)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #25 — [official issue page](https://www.marvel.com/comics/issue/13061/fantastic_four_1961_25)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

### `fantastic-four-004` — Fantastic Four #26-50

- [ ] #26 — [official issue page](https://www.marvel.com/comics/issue/13072/fantastic_four_1961_26)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13072/fantastic_four_1961_26
  - Direct cover URL:
  - Notes:

- [ ] #27 — [official issue page](https://www.marvel.com/comics/issue/13083/fantastic_four_1961_27)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13083/fantastic_four_1961_27
  - Direct cover URL:
  - Notes:

- [ ] #28 — [official issue page](https://www.marvel.com/comics/issue/13094/fantastic_four_1961_28)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13094/fantastic_four_1961_28
  - Direct cover URL:
  - Notes:

- [ ] #29 — [official issue page](https://www.marvel.com/comics/issue/13105/fantastic_four_1961_29)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13105/fantastic_four_1961_29
  - Direct cover URL:
  - Notes:

- [ ] #30 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Fantastic%20Four%20%2330%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #31 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Fantastic%20Four%20%2331%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #32 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Fantastic%20Four%20%2332%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #33 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Fantastic%20Four%20%2333%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #34 — [official issue page](https://www.marvel.com/comics/issue/13161/fantastic_four_1961_34)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13161/fantastic_four_1961_34
  - Direct cover URL:
  - Notes:

- [ ] #35 — [official issue page](https://www.marvel.com/comics/issue/13172/fantastic_four_1961_35)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13172/fantastic_four_1961_35
  - Direct cover URL:
  - Notes:

- [ ] #36 — [official issue page](https://www.marvel.com/comics/issue/13183/fantastic_four_1961_36)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13183/fantastic_four_1961_36
  - Direct cover URL:
  - Notes:

- [ ] #37 — [official issue page](https://www.marvel.com/comics/issue/13194/fantastic_four_1961_37)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13194/fantastic_four_1961_37
  - Direct cover URL:
  - Notes:

- [ ] #38 — [official issue page](https://www.marvel.com/comics/issue/13205/fantastic_four_1961_38)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13205/fantastic_four_1961_38
  - Direct cover URL:
  - Notes:

- [ ] #39 — [official issue page](https://www.marvel.com/comics/issue/13216/fantastic_four_1961_39)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13216/fantastic_four_1961_39
  - Direct cover URL:
  - Notes:

- [ ] #40 — [official issue page](https://www.marvel.com/comics/issue/13228/fantastic_four_1961_40)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13228/fantastic_four_1961_40
  - Direct cover URL:
  - Notes:

- [ ] #41 — [official issue page](https://www.marvel.com/comics/issue/13239/fantastic_four_1961_41)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13239/fantastic_four_1961_41
  - Direct cover URL:
  - Notes:

- [ ] #42 — [official issue page](https://www.marvel.com/comics/issue/13247/fantastic_four_1961_42)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13247/fantastic_four_1961_42
  - Direct cover URL:
  - Notes:

- [ ] #43 — [official issue page](https://www.marvel.com/comics/issue/13248/fantastic_four_1961_43)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13248/fantastic_four_1961_43
  - Direct cover URL:
  - Notes:

- [ ] #44 — [official issue page](https://www.marvel.com/comics/issue/13249/fantastic_four_1961_44)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13249/fantastic_four_1961_44
  - Direct cover URL:
  - Notes:

- [ ] #45 — [official issue page](https://www.marvel.com/comics/issue/13250/fantastic_four_1961_45)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13250/fantastic_four_1961_45
  - Direct cover URL:
  - Notes:

- [ ] #46 — [official issue page](https://www.marvel.com/comics/issue/13251/fantastic_four_1961_46)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13251/fantastic_four_1961_46
  - Direct cover URL:
  - Notes:

- [ ] #47 — [official issue page](https://www.marvel.com/comics/issue/13252/fantastic_four_1961_47)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13252/fantastic_four_1961_47
  - Direct cover URL:
  - Notes:

- [ ] #48 — [official issue page](https://www.marvel.com/comics/issue/13253/fantastic_four_1961_48)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13253/fantastic_four_1961_48
  - Direct cover URL:
  - Notes:

- [ ] #49 — [official issue page](https://www.marvel.com/comics/issue/13254/fantastic_four_1961_49)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13254/fantastic_four_1961_49
  - Direct cover URL:
  - Notes:

- [ ] #50 — [official issue page](https://www.marvel.com/comics/issue/13256/fantastic_four_1961_50)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13256/fantastic_four_1961_50
  - Direct cover URL:
  - Notes:

### `fantastic-four-005` — Fantastic Four #51-75

- [ ] #51 — [official issue page](https://www.marvel.com/comics/issue/13257/fantastic_four_1961_51)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13257/fantastic_four_1961_51
  - Direct cover URL:
  - Notes:

- [ ] #52 — [official issue page](https://www.marvel.com/comics/issue/13258/fantastic_four_1961_52)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13258/fantastic_four_1961_52
  - Direct cover URL:
  - Notes:

- [ ] #53 — [official issue page](https://www.marvel.com/comics/issue/13259/fantastic_four_1961_53)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13259/fantastic_four_1961_53
  - Direct cover URL:
  - Notes:

- [ ] #54 — [official issue page](https://www.marvel.com/comics/issue/13260/fantastic_four_1961_54)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13260/fantastic_four_1961_54
  - Direct cover URL:
  - Notes:

- [ ] #55 — [official issue page](https://www.marvel.com/comics/issue/13261/fantastic_four_1961_55)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13261/fantastic_four_1961_55
  - Direct cover URL:
  - Notes:

- [ ] #56 — [official issue page](https://www.marvel.com/comics/issue/13262/fantastic_four_1961_56)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13262/fantastic_four_1961_56
  - Direct cover URL:
  - Notes:

- [ ] #57 — [official issue page](https://www.marvel.com/comics/issue/13263/fantastic_four_1961_57)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13263/fantastic_four_1961_57
  - Direct cover URL:
  - Notes:

- [ ] #58 — [official issue page](https://www.marvel.com/comics/issue/13264/fantastic_four_1961_58)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13264/fantastic_four_1961_58
  - Direct cover URL:
  - Notes:

- [ ] #59 — [official issue page](https://www.marvel.com/comics/issue/13265/fantastic_four_1961_59)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13265/fantastic_four_1961_59
  - Direct cover URL:
  - Notes:

- [ ] #60 — [official issue page](https://www.marvel.com/comics/issue/13267/fantastic_four_1961_60)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13267/fantastic_four_1961_60
  - Direct cover URL:
  - Notes:

- [ ] #61 — [official issue page](https://www.marvel.com/comics/issue/13268/fantastic_four_1961_61)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13268/fantastic_four_1961_61
  - Direct cover URL:
  - Notes:

- [ ] #62 — [official issue page](https://www.marvel.com/comics/issue/13269/fantastic_four_1961_62)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13269/fantastic_four_1961_62
  - Direct cover URL:
  - Notes:

- [ ] #63 — [official issue page](https://www.marvel.com/comics/issue/13270/fantastic_four_1961_-_1998_63)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13270/fantastic_four_1961_-_1998_63
  - Direct cover URL:
  - Notes:

- [ ] #64 — [official issue page](https://www.marvel.com/comics/issue/13271/fantastic_four_1961_64)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13271/fantastic_four_1961_64
  - Direct cover URL:
  - Notes:

- [ ] #65 — [official issue page](https://www.marvel.com/comics/issue/13272/fantastic_four_1961_65)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13272/fantastic_four_1961_65
  - Direct cover URL:
  - Notes:

- [ ] #66 — [official issue page](https://www.marvel.com/comics/issue/13273/fantastic_four_1961_66)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13273/fantastic_four_1961_66
  - Direct cover URL:
  - Notes:

- [ ] #67 — [official issue page](https://www.marvel.com/comics/issue/13274/fantastic_four_1961_67)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13274/fantastic_four_1961_67
  - Direct cover URL:
  - Notes:

- [ ] #68 — [official issue page](https://www.marvel.com/comics/issue/13275/slug)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13275/slug
  - Direct cover URL:
  - Notes:

- [ ] #69 — [official issue page](https://www.marvel.com/comics/issue/13276/fantastic_four_1961_69)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13276/fantastic_four_1961_69
  - Direct cover URL:
  - Notes:

- [ ] #70 — [official issue page](https://www.marvel.com/comics/issue/13278/fantastic_four_1961_70)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13278/fantastic_four_1961_70
  - Direct cover URL:
  - Notes:

- [ ] #71 — [official issue page](https://www.marvel.com/comics/issue/13279/fantastic_four_1961_71)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13279/fantastic_four_1961_71
  - Direct cover URL:
  - Notes:

- [ ] #72 — [official issue page](https://www.marvel.com/comics/issue/13280/fantastic_four_1961_72)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13280/fantastic_four_1961_72
  - Direct cover URL:
  - Notes:

- [ ] #73 — [official issue page](https://www.marvel.com/comics/issue/13281)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13281
  - Direct cover URL:
  - Notes:

- [ ] #74 — [official issue page](https://www.marvel.com/comics/issue/13282/fantastic_four_1961_74)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13282/fantastic_four_1961_74
  - Direct cover URL:
  - Notes:

- [ ] #75 — [official issue page](https://www.marvel.com/comics/issue/13283/fantastic_four_1961_75)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13283/fantastic_four_1961_75
  - Direct cover URL:
  - Notes:

### `fantastic-four-035` — Fantastic Four #76-100

- [ ] #76 — [official issue page](https://www.marvel.com/comics/issue/13284/fantastic_four_1961_76)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13284/fantastic_four_1961_76
  - Direct cover URL:
  - Notes:

- [ ] #77 — [official issue page](https://www.marvel.com/comics/issue/13285/fantastic_four_1961_77)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13285/fantastic_four_1961_77
  - Direct cover URL:
  - Notes:

- [ ] #78 — [official issue page](https://www.marvel.com/comics/issue/13286/fantastic_four_1961_78)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13286/fantastic_four_1961_78
  - Direct cover URL:
  - Notes:

- [ ] #79 — [official issue page](https://www.marvel.com/comics/issue/13287/fantastic_four_1961_79)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13287/fantastic_four_1961_79
  - Direct cover URL:
  - Notes:

- [ ] #80 — [official issue page](https://www.marvel.com/comics/issue/13289/fantastic_four_1961_80)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13289/fantastic_four_1961_80
  - Direct cover URL:
  - Notes:

- [ ] #81 — [official issue page](https://www.marvel.com/comics/issue/13290/fantastic_four_1961_81)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13290/fantastic_four_1961_81
  - Direct cover URL:
  - Notes:

- [ ] #82 — [official issue page](https://www.marvel.com/comics/issue/13291/fantastic_four_1961_82)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13291/fantastic_four_1961_82
  - Direct cover URL:
  - Notes:

- [ ] #83 — [official issue page](https://www.marvel.com/comics/issue/13292/fantastic_four_1961_83)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13292/fantastic_four_1961_83
  - Direct cover URL:
  - Notes:

- [ ] #84 — [official issue page](https://www.marvel.com/comics/issue/13293/)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13293/
  - Direct cover URL:
  - Notes:

- [ ] #85 — [official issue page](https://www.marvel.com/comics/issue/13294/fantastic_four_1961_85)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13294/fantastic_four_1961_85
  - Direct cover URL:
  - Notes:

- [ ] #86 — [official issue page](https://www.marvel.com/comics/issue/13295/x)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13295/x
  - Direct cover URL:
  - Notes:

- [ ] #87 — [official issue page](https://www.marvel.com/comics/issue/13296/fantastic_four_1961_87)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13296/fantastic_four_1961_87
  - Direct cover URL:
  - Notes:

- [ ] #88 — [official issue page](https://www.marvel.com/comics/issue/13297/fantastic_four_1961_88)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13297/fantastic_four_1961_88
  - Direct cover URL:
  - Notes:

- [ ] #89 — [official issue page](https://www.marvel.com/comics/issue/13298/fantastic_four_1961_89)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13298/fantastic_four_1961_89
  - Direct cover URL:
  - Notes:

- [ ] #90 — [official issue page](https://www.marvel.com/comics/issue/13300/fantastic_four_1961_90)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13300/fantastic_four_1961_90
  - Direct cover URL:
  - Notes:

- [ ] #91 — [official issue page](https://www.marvel.com/comics/issue/13301/fantastic_four_1961_91)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13301/fantastic_four_1961_91
  - Direct cover URL:
  - Notes:

- [ ] #92 — [official issue page](https://www.marvel.com/comics/issue/13302/fantastic_four_1961_92)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13302/fantastic_four_1961_92
  - Direct cover URL:
  - Notes:

- [ ] #93 — [official issue page](https://www.marvel.com/comics/issue/13303/fantastic_four_1961_93)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13303/fantastic_four_1961_93
  - Direct cover URL:
  - Notes:

- [ ] #94 — [official issue page](https://www.marvel.com/comics/issue/13304/fantastic_four_1961_94)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13304/fantastic_four_1961_94
  - Direct cover URL:
  - Notes:

- [ ] #95 — [official issue page](https://www.marvel.com/comics/issue/13305/fantastic_four_1961_95)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13305/fantastic_four_1961_95
  - Direct cover URL:
  - Notes:

- [ ] #96 — [official issue page](https://www.marvel.com/comics/issue/13306/fantastic_four_1961_96)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13306/fantastic_four_1961_96
  - Direct cover URL:
  - Notes:

- [ ] #97 — [official issue page](https://www.marvel.com/comics/issue/13307/fantastic_four_1961_97)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13307/fantastic_four_1961_97
  - Direct cover URL:
  - Notes:

- [ ] #98 — [official issue page](https://www.marvel.com/comics/issue/13308/fantastic_four_1961_98)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13308/fantastic_four_1961_98
  - Direct cover URL:
  - Notes:

- [ ] #99 — [official issue page](https://www.marvel.com/comics/issue/13309/fantastic_four_1961_99)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13309/fantastic_four_1961_99
  - Direct cover URL:
  - Notes:

- [ ] #100 — [official issue page](https://www.marvel.com/comics/issue/12896/fantastic_four_1961_100)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/12896/fantastic_four_1961_100
  - Direct cover URL:
  - Notes:

### `fantastic-four-036` — Fantastic Four #101-125

- [ ] #101 — [official issue page](https://www.marvel.com/comics/issue/12897)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/12897
  - Direct cover URL:
  - Notes:

- [ ] #102 — [official issue page](https://www.marvel.com/comics/issue/12898/fantastic_four_1961_102)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/12898/fantastic_four_1961_102
  - Direct cover URL:
  - Notes:

- [ ] #103 — [official issue page](https://www.marvel.com/comics/issue/12899/fantastic_four_1961_103)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/12899/fantastic_four_1961_103
  - Direct cover URL:
  - Notes:

- [ ] #104 — [official issue page](https://www.marvel.com/comics/issue/12900/)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/12900/
  - Direct cover URL:
  - Notes:

- [ ] #105 — [official issue page](https://www.marvel.com/comics/issue/12901/fantastic_four_1961_105)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/12901/fantastic_four_1961_105
  - Direct cover URL:
  - Notes:

- [ ] #106 — [official issue page](https://www.marvel.com/comics/issue/12902/fantastic_four_1961_106)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/12902/fantastic_four_1961_106
  - Direct cover URL:
  - Notes:

- [ ] #107 — [official issue page](https://www.marvel.com/comics/issue/12903/fantastic_four_1961_107)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/12903/fantastic_four_1961_107
  - Direct cover URL:
  - Notes:

- [ ] #108 — [official issue page](https://www.marvel.com/comics/issue/12904/fantastic_four_1961_108)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/12904/fantastic_four_1961_108
  - Direct cover URL:
  - Notes:

- [ ] #109 — [official issue page](https://www.marvel.com/comics/issue/12905/fantastic_four_1961_109)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/12905/fantastic_four_1961_109
  - Direct cover URL:
  - Notes:

- [ ] #110 — [official issue page](https://www.marvel.com/comics/issue/12907/fantastic_four_1961_110)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/12907/fantastic_four_1961_110
  - Direct cover URL:
  - Notes:

- [ ] #111 — [official issue page](https://www.marvel.com/comics/issue/12908/fantastic_four_1961_111)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/12908/fantastic_four_1961_111
  - Direct cover URL:
  - Notes:

- [ ] #112 — [official issue page](https://www.marvel.com/comics/issue/12909/fantastic_four_1961_112)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/12909/fantastic_four_1961_112
  - Direct cover URL:
  - Notes:

- [ ] #113 — [official issue page](https://www.marvel.com/comics/issue/12910/fantastic_four_1961_113)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/12910/fantastic_four_1961_113
  - Direct cover URL:
  - Notes:

- [ ] #114 — [official issue page](https://www.marvel.com/comics/issue/12911/fantastic_four_1961_114)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/12911/fantastic_four_1961_114
  - Direct cover URL:
  - Notes:

- [ ] #115 — [official issue page](https://www.marvel.com/comics/issue/12912/fantastic_four_1961_115)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/12912/fantastic_four_1961_115
  - Direct cover URL:
  - Notes:

- [ ] #116 — [official issue page](https://www.marvel.com/comics/issue/12913/fantastic_four_1961_116)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/12913/fantastic_four_1961_116
  - Direct cover URL:
  - Notes:

- [ ] #117 — [official issue page](https://www.marvel.com/comics/issue/12914/fantastic_four_1961_117)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/12914/fantastic_four_1961_117
  - Direct cover URL:
  - Notes:

- [ ] #118 — [official issue page](https://www.marvel.com/comics/issue/12915/fantastic_four_1961_118)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/12915/fantastic_four_1961_118
  - Direct cover URL:
  - Notes:

- [ ] #119 — [official issue page](https://www.marvel.com/comics/issue/12916/fantastic-four-1961-119)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/12916/fantastic-four-1961-119
  - Direct cover URL:
  - Notes:

- [ ] #120 — [official issue page](https://www.marvel.com/comics/issue/12918/fantastic_four_1961_120)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/12918/fantastic_four_1961_120
  - Direct cover URL:
  - Notes:

- [ ] #121 — [official issue page](https://www.marvel.com/comics/issue/12919/fantastic_four_1961_121)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/12919/fantastic_four_1961_121
  - Direct cover URL:
  - Notes:

- [ ] #122 — [official issue page](https://www.marvel.com/comics/issue/12920/fantastic_four_1961_122)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/12920/fantastic_four_1961_122
  - Direct cover URL:
  - Notes:

- [ ] #123 — [official issue page](https://www.marvel.com/comics/issue/12921/fantastic_four_1961_123)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/12921/fantastic_four_1961_123
  - Direct cover URL:
  - Notes:

- [ ] #124 — [official issue page](https://www.marvel.com/comics/issue/12922/fantastic_four_1961_124)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/12922/fantastic_four_1961_124
  - Direct cover URL:
  - Notes:

- [ ] #125 — [official issue page](https://www.marvel.com/comics/issue/12923/fantastic_four_1961_125)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/12923/fantastic_four_1961_125
  - Direct cover URL:
  - Notes:

### `fantastic-four-037` — Fantastic Four #126-150

- [ ] #126 — [official issue page](https://www.marvel.com/comics/issue/12924/fantastic_four_1961_126)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/12924/fantastic_four_1961_126
  - Direct cover URL:
  - Notes:

- [ ] #127 — [official issue page](https://www.marvel.com/comics/issue/12925/fantastic_four_1961_127)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/12925/fantastic_four_1961_127
  - Direct cover URL:
  - Notes:

- [ ] #128 — [official issue page](https://www.marvel.com/comics/issue/12926/fantastic_four_1961_128)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/12926/fantastic_four_1961_128
  - Direct cover URL:
  - Notes:

- [ ] #129 — [official issue page](https://www.marvel.com/comics/issue/12927/fantastic_four_1961_129)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/12927/fantastic_four_1961_129
  - Direct cover URL:
  - Notes:

- [ ] #130 — [official issue page](https://www.marvel.com/comics/issue/12929/fantastic_four_1961_130)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/12929/fantastic_four_1961_130
  - Direct cover URL:
  - Notes:

- [ ] #131 — [official issue page](https://www.marvel.com/comics/issue/12930/fantastic_four_1961_131)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/12930/fantastic_four_1961_131
  - Direct cover URL:
  - Notes:

- [ ] #132 — [official issue page](https://www.marvel.com/comics/issue/12931/fantastic_four_1961_132)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/12931/fantastic_four_1961_132
  - Direct cover URL:
  - Notes:

- [ ] #133 — [official issue page](https://www.marvel.com/comics/issue/12932/fantastic_four_1961_133)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/12932/fantastic_four_1961_133
  - Direct cover URL:
  - Notes:

- [ ] #134 — [official issue page](https://www.marvel.com/comics/issue/12933/fantastic_four_1961_134)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/12933/fantastic_four_1961_134
  - Direct cover URL:
  - Notes:

- [ ] #135 — [official issue page](https://www.marvel.com/comics/issue/12934)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/12934
  - Direct cover URL:
  - Notes:

- [ ] #136 — [official issue page](https://www.marvel.com/comics/issue/12935/fantastic_four_1961_136)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/12935/fantastic_four_1961_136
  - Direct cover URL:
  - Notes:

- [ ] #137 — [official issue page](https://www.marvel.com/comics/issue/12936/fantastic_four_1961_137)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/12936/fantastic_four_1961_137
  - Direct cover URL:
  - Notes:

- [ ] #138 — [official issue page](https://www.marvel.com/comics/issue/12937/fantastic_four_1961_138)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/12937/fantastic_four_1961_138
  - Direct cover URL:
  - Notes:

- [ ] #139 — [official issue page](https://www.marvel.com/comics/issue/12938/fantastic_four_1961_139)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/12938/fantastic_four_1961_139
  - Direct cover URL:
  - Notes:

- [ ] #140 — [official issue page](https://www.marvel.com/comics/issue/12940/fantastic_four_1961_140)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/12940/fantastic_four_1961_140
  - Direct cover URL:
  - Notes:

- [ ] #141 — [official issue page](https://www.marvel.com/comics/issue/12941/fantastic_four_1961_141)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/12941/fantastic_four_1961_141
  - Direct cover URL:
  - Notes:

- [ ] #142 — [official issue page](https://www.marvel.com/comics/issue/12942/fantastic_four_1961_142)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/12942/fantastic_four_1961_142
  - Direct cover URL:
  - Notes:

- [ ] #143 — [official issue page](https://www.marvel.com/comics/issue/12943/fantastic_four_1961_143)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/12943/fantastic_four_1961_143
  - Direct cover URL:
  - Notes:

- [ ] #144 — [official issue page](https://www.marvel.com/comics/issue/12944/fantastic_four_1961_144)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/12944/fantastic_four_1961_144
  - Direct cover URL:
  - Notes:

- [ ] #145 — [official issue page](https://www.marvel.com/comics/issue/12945/fantastic_four_1961_145)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/12945/fantastic_four_1961_145
  - Direct cover URL:
  - Notes:

- [ ] #146 — [official issue page](https://www.marvel.com/comics/issue/12946/fantastic_four_1961_146)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/12946/fantastic_four_1961_146
  - Direct cover URL:
  - Notes:

- [ ] #147 — [official issue page](https://www.marvel.com/comics/issue/12947/fantastic_four_1961_147)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/12947/fantastic_four_1961_147
  - Direct cover URL:
  - Notes:

- [ ] #148 — [official issue page](https://www.marvel.com/comics/issue/12948/fantastic_four_1961_148)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/12948/fantastic_four_1961_148
  - Direct cover URL:
  - Notes:

- [ ] #149 — [official issue page](https://www.marvel.com/comics/issue/12949/fantastic_four_1961_149)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/12949/fantastic_four_1961_149
  - Direct cover URL:
  - Notes:

- [ ] #150 — [official issue page](https://www.marvel.com/comics/issue/12951)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/12951
  - Direct cover URL:
  - Notes:

### `fantastic-four-038` — Fantastic Four #151-175

- [ ] #151 — [official issue page](https://www.marvel.com/comics/issue/12952/fantastic_four_1961_151)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/12952/fantastic_four_1961_151
  - Direct cover URL:
  - Notes:

- [ ] #152 — [official issue page](https://www.marvel.com/comics/issue/12953/fantastic_four_1961_152)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/12953/fantastic_four_1961_152
  - Direct cover URL:
  - Notes:

- [ ] #153 — [official issue page](https://www.marvel.com/comics/issue/12954/fantastic_four_1961_153)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/12954/fantastic_four_1961_153
  - Direct cover URL:
  - Notes:

- [ ] #154 — [official issue page](https://www.marvel.com/comics/issue/12955/fantastic_four_1961_154)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/12955/fantastic_four_1961_154
  - Direct cover URL:
  - Notes:

- [ ] #155 — [official issue page](https://www.marvel.com/comics/issue/12956/fantastic_four_1961_155)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/12956/fantastic_four_1961_155
  - Direct cover URL:
  - Notes:

- [ ] #156 — [official issue page](https://www.marvel.com/comics/issue/12957/fantastic_four_1961_156)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/12957/fantastic_four_1961_156
  - Direct cover URL:
  - Notes:

- [ ] #157 — [official issue page](https://www.marvel.com/comics/issue/12958/fantastic_four_1961_-_1998_157)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/12958/fantastic_four_1961_-_1998_157
  - Direct cover URL:
  - Notes:

- [ ] #158 — [official issue page](https://www.marvel.com/comics/issue/12959/fantastic_four_1961_158)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/12959/fantastic_four_1961_158
  - Direct cover URL:
  - Notes:

- [ ] #159 — [official issue page](https://www.marvel.com/comics/issue/12960/fantastic_four_1961_159)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/12960/fantastic_four_1961_159
  - Direct cover URL:
  - Notes:

- [ ] #160 — [official issue page](https://www.marvel.com/comics/issue/12962/fantastic_four_1961_160)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/12962/fantastic_four_1961_160
  - Direct cover URL:
  - Notes:

- [ ] #161 — [official issue page](https://www.marvel.com/comics/issue/12963/fantastic_four_1961_161)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/12963/fantastic_four_1961_161
  - Direct cover URL:
  - Notes:

- [ ] #162 — [official issue page](https://www.marvel.com/comics/issue/12964/fantastic_four_1961_162)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/12964/fantastic_four_1961_162
  - Direct cover URL:
  - Notes:

- [ ] #163 — [official issue page](https://www.marvel.com/comics/issue/12965/fantastic_four_1961_163)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/12965/fantastic_four_1961_163
  - Direct cover URL:
  - Notes:

- [ ] #164 — [official issue page](https://www.marvel.com/comics/issue/12966/fantastic_four_1961_164)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/12966/fantastic_four_1961_164
  - Direct cover URL:
  - Notes:

- [ ] #165 — [official issue page](https://www.marvel.com/comics/issue/12967/fantastic_four_1961_165)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/12967/fantastic_four_1961_165
  - Direct cover URL:
  - Notes:

- [ ] #166 — [official issue page](https://www.marvel.com/comics/issue/12968/fantastic_four_1961_166)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/12968/fantastic_four_1961_166
  - Direct cover URL:
  - Notes:

- [ ] #167 — [official issue page](https://www.marvel.com/comics/issue/12969/fantastic_four_1961_167)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/12969/fantastic_four_1961_167
  - Direct cover URL:
  - Notes:

- [ ] #168 — [official issue page](https://www.marvel.com/comics/issue/12970/fantastic_four_1961_168)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/12970/fantastic_four_1961_168
  - Direct cover URL:
  - Notes:

- [ ] #169 — [official issue page](https://www.marvel.com/comics/issue/12971/fantastic_four_1961_169)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/12971/fantastic_four_1961_169
  - Direct cover URL:
  - Notes:

- [ ] #170 — [official issue page](https://www.marvel.com/comics/issue/12973/fantastic_four_1961_170)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/12973/fantastic_four_1961_170
  - Direct cover URL:
  - Notes:

- [ ] #171 — [official issue page](https://www.marvel.com/comics/issue/12974/fantastic_four_1961_171)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/12974/fantastic_four_1961_171
  - Direct cover URL:
  - Notes:

- [ ] #172 — [official issue page](https://www.marvel.com/comics/issue/12975/fantastic_four_1961_172)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/12975/fantastic_four_1961_172
  - Direct cover URL:
  - Notes:

- [ ] #173 — [official issue page](https://www.marvel.com/comics/issue/12976/fantastic_four_1961_173)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/12976/fantastic_four_1961_173
  - Direct cover URL:
  - Notes:

- [ ] #174 — [official issue page](https://www.marvel.com/comics/issue/12977/fantastic_four_1961_174)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/12977/fantastic_four_1961_174
  - Direct cover URL:
  - Notes:

- [ ] #175 — [official issue page](https://www.marvel.com/comics/issue/12978/fantastic_four_1961_175)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/12978/fantastic_four_1961_175
  - Direct cover URL:
  - Notes:

### `fantastic-four-039` — Fantastic Four #176-200

- [ ] #176 — [official issue page](https://www.marvel.com/comics/issue/12979/fantastic_four_1961_176)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/12979/fantastic_four_1961_176
  - Direct cover URL:
  - Notes:

- [ ] #177 — [official issue page](https://www.marvel.com/comics/issue/12980/fantastic_four_1961_177)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/12980/fantastic_four_1961_177
  - Direct cover URL:
  - Notes:

- [ ] #178 — [official issue page](https://www.marvel.com/comics/issue/12981/fantastic_four_1961_178)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/12981/fantastic_four_1961_178
  - Direct cover URL:
  - Notes:

- [ ] #179 — [official issue page](https://www.marvel.com/comics/issue/12982/fantastic_four_1961_179)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/12982/fantastic_four_1961_179
  - Direct cover URL:
  - Notes:

- [ ] #180 — [official issue page](https://www.marvel.com/comics/issue/12984/fantastic_four_1961_180)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/12984/fantastic_four_1961_180
  - Direct cover URL:
  - Notes:

- [ ] #181 — [official issue page](https://www.marvel.com/comics/issue/12985/fantastic_four_1961_181)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/12985/fantastic_four_1961_181
  - Direct cover URL:
  - Notes:

- [ ] #182 — [official issue page](https://www.marvel.com/comics/issue/12986/fantastic_four_1961_182)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/12986/fantastic_four_1961_182
  - Direct cover URL:
  - Notes:

- [ ] #183 — [official issue page](https://www.marvel.com/comics/issue/12987/fantastic_four_1961_183)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/12987/fantastic_four_1961_183
  - Direct cover URL:
  - Notes:

- [ ] #184 — [official issue page](https://www.marvel.com/comics/issue/12988/fantastic_four_1961_184)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/12988/fantastic_four_1961_184
  - Direct cover URL:
  - Notes:

- [ ] #185 — [official issue page](https://www.marvel.com/comics/issue/12989/fantastic_four_1961_185)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/12989/fantastic_four_1961_185
  - Direct cover URL:
  - Notes:

- [ ] #186 — [official issue page](https://www.marvel.com/comics/issue/12990/fantastic_four_1961_186)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/12990/fantastic_four_1961_186
  - Direct cover URL:
  - Notes:

- [ ] #187 — [official issue page](https://www.marvel.com/comics/issue/12991/fantastic_four_1961_187)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/12991/fantastic_four_1961_187
  - Direct cover URL:
  - Notes:

- [ ] #188 — [official issue page](https://www.marvel.com/comics/issue/12992/fantastic_four_1961_188)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/12992/fantastic_four_1961_188
  - Direct cover URL:
  - Notes:

- [ ] #189 — [official issue page](https://www.marvel.com/comics/issue/12993/fantastic_four_1961_189)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/12993/fantastic_four_1961_189
  - Direct cover URL:
  - Notes:

- [ ] #190 — [official issue page](https://www.marvel.com/comics/issue/12995/fantastic_four_1961_190)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/12995/fantastic_four_1961_190
  - Direct cover URL:
  - Notes:

- [ ] #191 — [official issue page](https://www.marvel.com/comics/issue/12996/fantastic_four_1961_191)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/12996/fantastic_four_1961_191
  - Direct cover URL:
  - Notes:

- [ ] #192 — [official issue page](https://www.marvel.com/comics/issue/12997/fantastic_four_1961_192)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/12997/fantastic_four_1961_192
  - Direct cover URL:
  - Notes:

- [ ] #193 — [official issue page](https://www.marvel.com/comics/issue/12998/fantastic_four_1961_193)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/12998/fantastic_four_1961_193
  - Direct cover URL:
  - Notes:

- [ ] #194 — [official issue page](https://www.marvel.com/comics/issue/12999/fantastic_four_1961_194)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/12999/fantastic_four_1961_194
  - Direct cover URL:
  - Notes:

- [ ] #195 — [official issue page](https://www.marvel.com/comics/issue/13000/fantastic_four_1961_195)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13000/fantastic_four_1961_195
  - Direct cover URL:
  - Notes:

- [ ] #196 — [official issue page](https://www.marvel.com/comics/issue/13001/fantastic_four_1961_196)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13001/fantastic_four_1961_196
  - Direct cover URL:
  - Notes:

- [ ] #197 — [official issue page](https://www.marvel.com/comics/issue/13002/fantastic_four_1961_197)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13002/fantastic_four_1961_197
  - Direct cover URL:
  - Notes:

- [ ] #198 — [official issue page](https://www.marvel.com/comics/issue/13003/fantastic_four_1961_198)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13003/fantastic_four_1961_198
  - Direct cover URL:
  - Notes:

- [ ] #199 — [official issue page](https://www.marvel.com/comics/issue/13004/fantastic_four_1961_199)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13004/fantastic_four_1961_199
  - Direct cover URL:
  - Notes:

- [ ] #200 — [official issue page](https://www.marvel.com/comics/issue/13007/fantastic_four_1961_200)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13007/fantastic_four_1961_200
  - Direct cover URL:
  - Notes:

### `fantastic-four-006` — Fantastic Four #201-225

- [ ] #201 — [official issue page](https://www.marvel.com/comics/issue/13008/fantastic_four_1961_201)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13008/fantastic_four_1961_201
  - Direct cover URL:
  - Notes:

- [ ] #202 — [official issue page](https://www.marvel.com/comics/issue/13009/fantastic_four_1961_202)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13009/fantastic_four_1961_202
  - Direct cover URL:
  - Notes:

- [ ] #203 — [official issue page](https://www.marvel.com/comics/issue/13010/fantastic_four_1961_203)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13010/fantastic_four_1961_203
  - Direct cover URL:
  - Notes:

- [ ] #204 — [official issue page](https://www.marvel.com/comics/issue/13011/fantastic_four_1961_204)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13011/fantastic_four_1961_204
  - Direct cover URL:
  - Notes:

- [ ] #205 — [official issue page](https://www.marvel.com/comics/issue/13012/fantastic_four_1961_205)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13012/fantastic_four_1961_205
  - Direct cover URL:
  - Notes:

- [ ] #206 — [official issue page](https://www.marvel.com/comics/issue/13013/fantastic_four_1961_206)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13013/fantastic_four_1961_206
  - Direct cover URL:
  - Notes:

- [ ] #207 — [official issue page](https://www.marvel.com/comics/issue/13014/fantastic_four_1961_207)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13014/fantastic_four_1961_207
  - Direct cover URL:
  - Notes:

- [ ] #208 — [official issue page](https://www.marvel.com/comics/issue/13015/fantastic_four_1961_208)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13015/fantastic_four_1961_208
  - Direct cover URL:
  - Notes:

- [ ] #209 — [official issue page](https://www.marvel.com/comics/issue/13016/fantastic_four_1961_209)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13016/fantastic_four_1961_209
  - Direct cover URL:
  - Notes:

- [ ] #210 — [official issue page](https://www.marvel.com/comics/issue/13018/fantastic_four_1961_210)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13018/fantastic_four_1961_210
  - Direct cover URL:
  - Notes:

- [ ] #211 — [official issue page](https://www.marvel.com/comics/issue/13019/fantastic_four_1961_211)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13019/fantastic_four_1961_211
  - Direct cover URL:
  - Notes:

- [ ] #212 — [official issue page](https://www.marvel.com/comics/issue/13020/fantastic_four_1961_212)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13020/fantastic_four_1961_212
  - Direct cover URL:
  - Notes:

- [ ] #213 — [official issue page](https://www.marvel.com/comics/issue/13021/fantastic_four_1961_213)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13021/fantastic_four_1961_213
  - Direct cover URL:
  - Notes:

- [ ] #214 — [official issue page](https://www.marvel.com/comics/issue/13022/fantastic_four_1961_214)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13022/fantastic_four_1961_214
  - Direct cover URL:
  - Notes:

- [ ] #215 — [official issue page](https://www.marvel.com/comics/issue/13023/)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13023/
  - Direct cover URL:
  - Notes:

- [ ] #216 — [official issue page](https://www.marvel.com/comics/issue/13024/fantastic_four_1961_216)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13024/fantastic_four_1961_216
  - Direct cover URL:
  - Notes:

- [ ] #217 — [official issue page](https://www.marvel.com/comics/issue/13025/fantastic_four_1961_217)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13025/fantastic_four_1961_217
  - Direct cover URL:
  - Notes:

- [ ] #218 — [official issue page](https://www.marvel.com/comics/issue/13026/fantastic_four_1961_218)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13026/fantastic_four_1961_218
  - Direct cover URL:
  - Notes:

- [ ] #219 — [official issue page](https://www.marvel.com/comics/issue/13027/fantastic_four_1961_219)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13027/fantastic_four_1961_219
  - Direct cover URL:
  - Notes:

- [ ] #220 — [official issue page](https://www.marvel.com/comics/issue/13029/fantastic_four_1961_220)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13029/fantastic_four_1961_220
  - Direct cover URL:
  - Notes:

- [ ] #221 — [official issue page](https://www.marvel.com/comics/issue/13030/fantastic_four_1961_221)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13030/fantastic_four_1961_221
  - Direct cover URL:
  - Notes:

- [ ] #222 — [official issue page](https://www.marvel.com/comics/issue/13031/fantastic_four_1961_222)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13031/fantastic_four_1961_222
  - Direct cover URL:
  - Notes:

- [ ] #223 — [official issue page](https://www.marvel.com/comics/issue/13032/fantastic_four_1961_223)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13032/fantastic_four_1961_223
  - Direct cover URL:
  - Notes:

- [ ] #224 — [official issue page](https://www.marvel.com/comics/issue/13033/fantastic_four_1961_224)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13033/fantastic_four_1961_224
  - Direct cover URL:
  - Notes:

- [ ] #225 — [official issue page](https://www.marvel.com/comics/issue/13034/fantastic_four_1961_225)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13034/fantastic_four_1961_225
  - Direct cover URL:
  - Notes:

### `fantastic-four-007` — Fantastic Four #226-250

- [ ] #226 — [official issue page](https://www.marvel.com/comics/issue/13035/fantastic_four_1961_226)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13035/fantastic_four_1961_226
  - Direct cover URL:
  - Notes:

- [ ] #227 — [official issue page](https://www.marvel.com/comics/issue/13036/fantastic_four_1961_227)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13036/fantastic_four_1961_227
  - Direct cover URL:
  - Notes:

- [ ] #228 — [official issue page](https://www.marvel.com/comics/issue/13037/fantastic_four_1961_228)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13037/fantastic_four_1961_228
  - Direct cover URL:
  - Notes:

- [ ] #229 — [official issue page](https://www.marvel.com/comics/issue/13038/fantastic_four_1961_229)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13038/fantastic_four_1961_229
  - Direct cover URL:
  - Notes:

- [ ] #230 — [official issue page](https://www.marvel.com/comics/issue/13040/fantastic_four_1961_230)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13040/fantastic_four_1961_230
  - Direct cover URL:
  - Notes:

- [ ] #231 — [official issue page](https://www.marvel.com/comics/issue/13041/fantastic_four_1961_231)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13041/fantastic_four_1961_231
  - Direct cover URL:
  - Notes:

- [ ] #232 — [official issue page](https://www.marvel.com/comics/issue/13042/fantastic_four_1961_232)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13042/fantastic_four_1961_232
  - Direct cover URL:
  - Notes:

- [ ] #233 — [official issue page](https://www.marvel.com/comics/issue/13043/fantastic_four_1961_233)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13043/fantastic_four_1961_233
  - Direct cover URL:
  - Notes:

- [ ] #234 — [official issue page](https://www.marvel.com/comics/issue/13044/fantastic_four_1961_234)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13044/fantastic_four_1961_234
  - Direct cover URL:
  - Notes:

- [ ] #235 — [official issue page](https://www.marvel.com/comics/issue/13045/fantastic-four-1961-235)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13045/fantastic-four-1961-235
  - Direct cover URL:
  - Notes:

- [ ] #236 — [official issue page](https://www.marvel.com/comics/issue/13046/fantastic_four_1961_236)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13046/fantastic_four_1961_236
  - Direct cover URL:
  - Notes:

- [ ] #237 — [official issue page](https://www.marvel.com/comics/issue/13047/fantastic_four_1961_237)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13047/fantastic_four_1961_237
  - Direct cover URL:
  - Notes:

- [ ] #238 — [official issue page](https://www.marvel.com/comics/issue/13048/fantastic_four_1961_238)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13048/fantastic_four_1961_238
  - Direct cover URL:
  - Notes:

- [ ] #239 — [official issue page](https://www.marvel.com/comics/issue/13049/fantastic_four_1961_239)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13049/fantastic_four_1961_239
  - Direct cover URL:
  - Notes:

- [ ] #240 — [official issue page](https://www.marvel.com/comics/issue/13051/fantastic_four_1961_240)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13051/fantastic_four_1961_240
  - Direct cover URL:
  - Notes:

- [ ] #241 — [official issue page](https://www.marvel.com/comics/issue/13052/fantastic_four_1961_241)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13052/fantastic_four_1961_241
  - Direct cover URL:
  - Notes:

- [ ] #242 — [official issue page](https://www.marvel.com/comics/issue/13053/fantastic-four-1961-242)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13053/fantastic-four-1961-242
  - Direct cover URL:
  - Notes:

- [ ] #243 — [official issue page](https://www.marvel.com/comics/issue/13054/fantastic_four_1961_243)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13054/fantastic_four_1961_243
  - Direct cover URL:
  - Notes:

- [ ] #244 — [official issue page](https://www.marvel.com/comics/issue/13055/fantastic_four_1961_244)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13055/fantastic_four_1961_244
  - Direct cover URL:
  - Notes:

- [ ] #245 — [official issue page](https://www.marvel.com/comics/issue/13056/)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13056/
  - Direct cover URL:
  - Notes:

- [ ] #246 — [official issue page](https://www.marvel.com/comics/issue/13057/fantastic_four_1961_246)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13057/fantastic_four_1961_246
  - Direct cover URL:
  - Notes:

- [ ] #247 — [official issue page](https://www.marvel.com/comics/issue/13058/fantastic_four_1961_247)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13058/fantastic_four_1961_247
  - Direct cover URL:
  - Notes:

- [ ] #248 — [official issue page](https://www.marvel.com/comics/issue/13059/fantastic_four_1961_248)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13059/fantastic_four_1961_248
  - Direct cover URL:
  - Notes:

- [ ] #249 — [official issue page](https://www.marvel.com/comics/issue/13060/fantastic_four_1961_249)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13060/fantastic_four_1961_249
  - Direct cover URL:
  - Notes:

- [ ] #250 — [official issue page](https://www.marvel.com/comics/issue/13062/fantastic_four_1961_250)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13062/fantastic_four_1961_250
  - Direct cover URL:
  - Notes:

### `fantastic-four-008` — Fantastic Four #251-275

- [ ] #251 — [official issue page](https://www.marvel.com/comics/issue/13063/)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13063/
  - Direct cover URL:
  - Notes:

- [ ] #252 — [official issue page](https://www.marvel.com/comics/issue/13064/fantastic_four_1961_252)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13064/fantastic_four_1961_252
  - Direct cover URL:
  - Notes:

- [ ] #253 — [official issue page](https://www.marvel.com/comics/issue/13065/fantastic_four_1961_253)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13065/fantastic_four_1961_253
  - Direct cover URL:
  - Notes:

- [ ] #254 — [official issue page](https://www.marvel.com/comics/issue/13066/fantastic_four_1961_254)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13066/fantastic_four_1961_254
  - Direct cover URL:
  - Notes:

- [ ] #255 — [official issue page](https://www.marvel.com/comics/issue/13067/fantastic_four_1961_255)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13067/fantastic_four_1961_255
  - Direct cover URL:
  - Notes:

- [ ] #256 — [official issue page](https://www.marvel.com/comics/issue/13068/fantastic_four_1961_256)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13068/fantastic_four_1961_256
  - Direct cover URL:
  - Notes:

- [ ] #257 — [official issue page](https://www.marvel.com/comics/issue/13069/fantastic_four_1961_257)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13069/fantastic_four_1961_257
  - Direct cover URL:
  - Notes:

- [ ] #258 — [official issue page](https://www.marvel.com/comics/issue/13070/fantastic_four_1961_258)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13070/fantastic_four_1961_258
  - Direct cover URL:
  - Notes:

- [ ] #259 — [official issue page](https://www.marvel.com/comics/issue/13071/fantastic_four_1961_259)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13071/fantastic_four_1961_259
  - Direct cover URL:
  - Notes:

- [ ] #260 — [official issue page](https://www.marvel.com/comics/issue/13073/)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13073/
  - Direct cover URL:
  - Notes:

- [ ] #261 — [official issue page](https://www.marvel.com/comics/issue/13074/fantastic_four_1961_261)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13074/fantastic_four_1961_261
  - Direct cover URL:
  - Notes:

- [ ] #262 — [official issue page](https://www.marvel.com/comics/issue/13075/fantastic_four_1961_262)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13075/fantastic_four_1961_262
  - Direct cover URL:
  - Notes:

- [ ] #263 — [official issue page](https://www.marvel.com/comics/issue/13076/fantastic_four_1961_263)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13076/fantastic_four_1961_263
  - Direct cover URL:
  - Notes:

- [ ] #264 — [official issue page](https://www.marvel.com/comics/issue/13077/read)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13077/read
  - Direct cover URL:
  - Notes:

- [ ] #265 — [official issue page](https://www.marvel.com/comics/issue/13078/fantastic_four_1961_265)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13078/fantastic_four_1961_265
  - Direct cover URL:
  - Notes:

- [ ] #266 — [official issue page](https://www.marvel.com/comics/issue/13079/fantastic_four_1961_266)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13079/fantastic_four_1961_266
  - Direct cover URL:
  - Notes:

- [ ] #267 — [official issue page](https://www.marvel.com/comics/issue/13080/fantastic_four_1961_267)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13080/fantastic_four_1961_267
  - Direct cover URL:
  - Notes:

- [ ] #268 — [official issue page](https://www.marvel.com/comics/issue/13081/fantastic_four_1961_268)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13081/fantastic_four_1961_268
  - Direct cover URL:
  - Notes:

- [ ] #269 — [official issue page](https://www.marvel.com/comics/issue/13082/fantastic_four_1961_269)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13082/fantastic_four_1961_269
  - Direct cover URL:
  - Notes:

- [ ] #270 — [official issue page](https://www.marvel.com/comics/issue/13084/fantastic_four_1961_270)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13084/fantastic_four_1961_270
  - Direct cover URL:
  - Notes:

- [ ] #271 — [official issue page](https://www.marvel.com/comics/issue/13085/fantastic_four_1961_271)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13085/fantastic_four_1961_271
  - Direct cover URL:
  - Notes:

- [ ] #272 — [official issue page](https://www.marvel.com/comics/issue/13086/fantastic_four_1961_272)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13086/fantastic_four_1961_272
  - Direct cover URL:
  - Notes:

- [ ] #273 — [official issue page](https://www.marvel.com/comics/issue/13087/fantastic_four_1961_273)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13087/fantastic_four_1961_273
  - Direct cover URL:
  - Notes:

- [ ] #274 — [official issue page](https://www.marvel.com/comics/issue/13088/fantastic_four_1961_274)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13088/fantastic_four_1961_274
  - Direct cover URL:
  - Notes:

- [ ] #275 — [official issue page](https://www.marvel.com/comics/issue/13089/fantastic_four_1961_275)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13089/fantastic_four_1961_275
  - Direct cover URL:
  - Notes:

### `fantastic-four-009` — Fantastic Four #276-300

- [ ] #276 — [official issue page](https://www.marvel.com/comics/issue/13090/fantastic_four_1961_276)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13090/fantastic_four_1961_276
  - Direct cover URL:
  - Notes:

- [ ] #277 — [official issue page](https://www.marvel.com/comics/issue/13091/fantastic_four_1961_277)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13091/fantastic_four_1961_277
  - Direct cover URL:
  - Notes:

- [ ] #278 — [official issue page](https://www.marvel.com/comics/issue/13092/fantastic_four_1961_278)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13092/fantastic_four_1961_278
  - Direct cover URL:
  - Notes:

- [ ] #279 — [official issue page](https://www.marvel.com/comics/issue/13093/fantastic_four_1961_279)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13093/fantastic_four_1961_279
  - Direct cover URL:
  - Notes:

- [ ] #280 — [official issue page](https://www.marvel.com/comics/issue/13095/)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13095/
  - Direct cover URL:
  - Notes:

- [ ] #281 — [official issue page](https://www.marvel.com/comics/issue/13096/fantastic_four_1961_281)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13096/fantastic_four_1961_281
  - Direct cover URL:
  - Notes:

- [ ] #282 — [official issue page](https://www.marvel.com/comics/issue/13097/fantastic_four_1961_282)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13097/fantastic_four_1961_282
  - Direct cover URL:
  - Notes:

- [ ] #283 — [official issue page](https://www.marvel.com/comics/issue/13098/fantastic_four_1961_283)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13098/fantastic_four_1961_283
  - Direct cover URL:
  - Notes:

- [ ] #284 — [official issue page](https://www.marvel.com/comics/issue/13099/fantastic_four_1961_284)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13099/fantastic_four_1961_284
  - Direct cover URL:
  - Notes:

- [ ] #285 — [official issue page](https://www.marvel.com/comics/issue/13100/fantastic_four_1961_285)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13100/fantastic_four_1961_285
  - Direct cover URL:
  - Notes:

- [ ] #286 — [official issue page](https://www.marvel.com/comics/issue/13101/fantastic_four_1961_286)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13101/fantastic_four_1961_286
  - Direct cover URL:
  - Notes:

- [ ] #287 — [official issue page](https://www.marvel.com/comics/issue/13102/fantastic_four_1961_287)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13102/fantastic_four_1961_287
  - Direct cover URL:
  - Notes:

- [ ] #288 — [official issue page](https://www.marvel.com/comics/issue/13103/fantastic_four_1961_288)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13103/fantastic_four_1961_288
  - Direct cover URL:
  - Notes:

- [ ] #289 — [official issue page](https://www.marvel.com/comics/issue/13104/fantastic_four_1961_289)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13104/fantastic_four_1961_289
  - Direct cover URL:
  - Notes:

- [ ] #290 — [official issue page](https://www.marvel.com/comics/issue/13106/fantastic_four_1961_290)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13106/fantastic_four_1961_290
  - Direct cover URL:
  - Notes:

- [ ] #291 — [official issue page](https://www.marvel.com/comics/issue/13107/fantastic_four_1961_291)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13107/fantastic_four_1961_291
  - Direct cover URL:
  - Notes:

- [ ] #292 — [official issue page](https://www.marvel.com/comics/issue/13108/fantastic_four_1961_292)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13108/fantastic_four_1961_292
  - Direct cover URL:
  - Notes:

- [ ] #293 — [official issue page](https://www.marvel.com/comics/issue/13109/fantastic_four_1961_293)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13109/fantastic_four_1961_293
  - Direct cover URL:
  - Notes:

- [ ] #294 — [official issue page](https://www.marvel.com/comics/issue/13110/fantastic_four_1961_294)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13110/fantastic_four_1961_294
  - Direct cover URL:
  - Notes:

- [ ] #295 — [official issue page](https://www.marvel.com/comics/issue/13111/fantastic_four_1961_295)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13111/fantastic_four_1961_295
  - Direct cover URL:
  - Notes:

- [ ] #296 — [official issue page](https://www.marvel.com/comics/issue/13112/fantastic_four_1961_296)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13112/fantastic_four_1961_296
  - Direct cover URL:
  - Notes:

- [ ] #297 — [official issue page](https://www.marvel.com/comics/issue/13113/fantastic_four_1961_297)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13113/fantastic_four_1961_297
  - Direct cover URL:
  - Notes:

- [ ] #298 — [official issue page](https://www.marvel.com/comics/issue/13114/fantastic_four_1961_298)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13114/fantastic_four_1961_298
  - Direct cover URL:
  - Notes:

- [ ] #299 — [official issue page](https://www.marvel.com/comics/issue/13115/fantastic_four_1961_299)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13115/fantastic_four_1961_299
  - Direct cover URL:
  - Notes:

- [ ] #300 — [official issue page](https://www.marvel.com/comics/issue/13118/fantastic_four_1961_300)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13118/fantastic_four_1961_300
  - Direct cover URL:
  - Notes:

### `fantastic-four-010` — Fantastic Four #301-325

- [ ] #301 — [official issue page](https://www.marvel.com/comics/issue/13119/fantastic_four_1961_301)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13119/fantastic_four_1961_301
  - Direct cover URL:
  - Notes:

- [ ] #302 — [official issue page](https://www.marvel.com/comics/issue/13120/fantastic_four_1961_302)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13120/fantastic_four_1961_302
  - Direct cover URL:
  - Notes:

- [ ] #303 — [official issue page](https://www.marvel.com/comics/issue/13121/)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13121/
  - Direct cover URL:
  - Notes:

- [ ] #304 — [official issue page](https://www.marvel.com/comics/issue/13122/fantastic_four_1961_304)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13122/fantastic_four_1961_304
  - Direct cover URL:
  - Notes:

- [ ] #305 — [official issue page](https://www.marvel.com/comics/issue/13123/fantastic_four_1961_305)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13123/fantastic_four_1961_305
  - Direct cover URL:
  - Notes:

- [ ] #306 — [official issue page](https://www.marvel.com/comics/issue/13124/fantastic_four_1961_306)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13124/fantastic_four_1961_306
  - Direct cover URL:
  - Notes:

- [ ] #307 — [official issue page](https://www.marvel.com/comics/issue/13125/fantastic_four_1961_307)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13125/fantastic_four_1961_307
  - Direct cover URL:
  - Notes:

- [ ] #308 — [official issue page](https://www.marvel.com/comics/issue/13126/fantastic_four_1961_308)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13126/fantastic_four_1961_308
  - Direct cover URL:
  - Notes:

- [ ] #309 — [official issue page](https://www.marvel.com/comics/issue/13127/fantastic_four_1961_309)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13127/fantastic_four_1961_309
  - Direct cover URL:
  - Notes:

- [ ] #310 — [official issue page](https://www.marvel.com/comics/issue/13129/fantastic_four_1961_310)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13129/fantastic_four_1961_310
  - Direct cover URL:
  - Notes:

- [ ] #311 — [official issue page](https://www.marvel.com/comics/issue/13130/fantastic_four_1961_311)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13130/fantastic_four_1961_311
  - Direct cover URL:
  - Notes:

- [ ] #312 — [official issue page](https://www.marvel.com/comics/issue/13131/fantastic_four_1961_312)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13131/fantastic_four_1961_312
  - Direct cover URL:
  - Notes:

- [ ] #313 — [official issue page](https://www.marvel.com/comics/issue/13132/fantastic_four_1961_313)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13132/fantastic_four_1961_313
  - Direct cover URL:
  - Notes:

- [ ] #314 — [official issue page](https://www.marvel.com/comics/issue/13133/fantastic_four_1961_314)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13133/fantastic_four_1961_314
  - Direct cover URL:
  - Notes:

- [ ] #315 — [official issue page](https://www.marvel.com/comics/issue/13134/fantastic_four_1961_315)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13134/fantastic_four_1961_315
  - Direct cover URL:
  - Notes:

- [ ] #316 — [official issue page](https://www.marvel.com/comics/issue/13135/fantastic_four_1961_316)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13135/fantastic_four_1961_316
  - Direct cover URL:
  - Notes:

- [ ] #317 — [official issue page](https://www.marvel.com/comics/issue/13136/fantastic_four_1961_317)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13136/fantastic_four_1961_317
  - Direct cover URL:
  - Notes:

- [ ] #318 — [official issue page](https://www.marvel.com/comics/issue/13137/fantastic_four_1961_318)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13137/fantastic_four_1961_318
  - Direct cover URL:
  - Notes:

- [ ] #319 — [official issue page](https://www.marvel.com/comics/issue/13138)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13138
  - Direct cover URL:
  - Notes:

- [ ] #320 — [official issue page](https://www.marvel.com/comics/issue/13140/fantastic_four_1961_320)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13140/fantastic_four_1961_320
  - Direct cover URL:
  - Notes:

- [ ] #321 — [official issue page](https://www.marvel.com/comics/issue/13141/fantastic_four_1961_321)
  - Official Marvel page URL: https://www.marvel.com/comics/issue/13141/fantastic_four_1961_321
  - Direct cover URL:
  - Notes:

- [ ] #322 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Fantastic%20Four%20%23322%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #323 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Fantastic%20Four%20%23323%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #324 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Fantastic%20Four%20%23324%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #325 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Fantastic%20Four%20%23325%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

### `fantastic-four-011` — Fantastic Four #326-350

- [ ] #326 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Fantastic%20Four%20%23326%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #327 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Fantastic%20Four%20%23327%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #328 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Fantastic%20Four%20%23328%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #329 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Fantastic%20Four%20%23329%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #330 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Fantastic%20Four%20%23330%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #331 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Fantastic%20Four%20%23331%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #332 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Fantastic%20Four%20%23332%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #333 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Fantastic%20Four%20%23333%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #334 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Fantastic%20Four%20%23334%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #335 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Fantastic%20Four%20%23335%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #336 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Fantastic%20Four%20%23336%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #337 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Fantastic%20Four%20%23337%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #338 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Fantastic%20Four%20%23338%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #339 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Fantastic%20Four%20%23339%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #340 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Fantastic%20Four%20%23340%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #341 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Fantastic%20Four%20%23341%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #342 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Fantastic%20Four%20%23342%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #343 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Fantastic%20Four%20%23343%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #344 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Fantastic%20Four%20%23344%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #345 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Fantastic%20Four%20%23345%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #346 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Fantastic%20Four%20%23346%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #347 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Fantastic%20Four%20%23347%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #348 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Fantastic%20Four%20%23348%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #349 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Fantastic%20Four%20%23349%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #350 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Fantastic%20Four%20%23350%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

### `fantastic-four-012` — Fantastic Four #351-375

- [ ] #351 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Fantastic%20Four%20%23351%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #352 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Fantastic%20Four%20%23352%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #353 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Fantastic%20Four%20%23353%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #354 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Fantastic%20Four%20%23354%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #355 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Fantastic%20Four%20%23355%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #356 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Fantastic%20Four%20%23356%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #357 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Fantastic%20Four%20%23357%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #358 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Fantastic%20Four%20%23358%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #359 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Fantastic%20Four%20%23359%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #360 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Fantastic%20Four%20%23360%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #361 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Fantastic%20Four%20%23361%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #362 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Fantastic%20Four%20%23362%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #363 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Fantastic%20Four%20%23363%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #364 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Fantastic%20Four%20%23364%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #365 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Fantastic%20Four%20%23365%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #366 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Fantastic%20Four%20%23366%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #367 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Fantastic%20Four%20%23367%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #368 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Fantastic%20Four%20%23368%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #369 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Fantastic%20Four%20%23369%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #370 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Fantastic%20Four%20%23370%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #371 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Fantastic%20Four%20%23371%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #372 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Fantastic%20Four%20%23372%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #373 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Fantastic%20Four%20%23373%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #374 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Fantastic%20Four%20%23374%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #375 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Fantastic%20Four%20%23375%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

### `fantastic-four-013` — Fantastic Four #376-400

- [ ] #376 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Fantastic%20Four%20%23376%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #377 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Fantastic%20Four%20%23377%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #378 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Fantastic%20Four%20%23378%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #379 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Fantastic%20Four%20%23379%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #380 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Fantastic%20Four%20%23380%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #381 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Fantastic%20Four%20%23381%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #382 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Fantastic%20Four%20%23382%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #383 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Fantastic%20Four%20%23383%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #384 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Fantastic%20Four%20%23384%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #385 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Fantastic%20Four%20%23385%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #386 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Fantastic%20Four%20%23386%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #387 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Fantastic%20Four%20%23387%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #388 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Fantastic%20Four%20%23388%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #389 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Fantastic%20Four%20%23389%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #390 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Fantastic%20Four%20%23390%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #391 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Fantastic%20Four%20%23391%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #392 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Fantastic%20Four%20%23392%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #393 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Fantastic%20Four%20%23393%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #394 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Fantastic%20Four%20%23394%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #395 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Fantastic%20Four%20%23395%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #396 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Fantastic%20Four%20%23396%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #397 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Fantastic%20Four%20%23397%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #398 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Fantastic%20Four%20%23398%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #399 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Fantastic%20Four%20%23399%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #400 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Fantastic%20Four%20%23400%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

### `fantastic-four-015` — 1997 series #1-25

- [ ] #1 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%221997%20series%20%231%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #2 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%221997%20series%20%232%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #3 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%221997%20series%20%233%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #4 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%221997%20series%20%234%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #5 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%221997%20series%20%235%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #6 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%221997%20series%20%236%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #7 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%221997%20series%20%237%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #8 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%221997%20series%20%238%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #9 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%221997%20series%20%239%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #10 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%221997%20series%20%2310%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #11 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%221997%20series%20%2311%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #12 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%221997%20series%20%2312%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #13 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%221997%20series%20%2313%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #14 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%221997%20series%20%2314%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #15 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%221997%20series%20%2315%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #16 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%221997%20series%20%2316%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #17 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%221997%20series%20%2317%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #18 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%221997%20series%20%2318%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #19 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%221997%20series%20%2319%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #20 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%221997%20series%20%2320%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #21 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%221997%20series%20%2321%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #22 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%221997%20series%20%2322%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #23 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%221997%20series%20%2323%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #24 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%221997%20series%20%2324%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #25 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%221997%20series%20%2325%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

### `fantastic-four-016` — 1997 series #26-50

- [ ] #26 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%221997%20series%20%2326%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #27 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%221997%20series%20%2327%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #28 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%221997%20series%20%2328%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #29 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%221997%20series%20%2329%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #30 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%221997%20series%20%2330%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #31 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%221997%20series%20%2331%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #32 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%221997%20series%20%2332%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #33 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%221997%20series%20%2333%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #34 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%221997%20series%20%2334%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #35 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%221997%20series%20%2335%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #36 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%221997%20series%20%2336%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #37 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%221997%20series%20%2337%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #38 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%221997%20series%20%2338%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #39 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%221997%20series%20%2339%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #40 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%221997%20series%20%2340%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #41 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%221997%20series%20%2341%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #42 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%221997%20series%20%2342%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #43 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%221997%20series%20%2343%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #44 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%221997%20series%20%2344%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #45 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%221997%20series%20%2345%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #46 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%221997%20series%20%2346%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #47 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%221997%20series%20%2347%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #48 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%221997%20series%20%2348%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #49 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%221997%20series%20%2349%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #50 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%221997%20series%20%2350%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

### `fantastic-four-042` — 1997 series #51-70

- [ ] #51 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%221997%20series%20%2351%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #52 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%221997%20series%20%2352%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #53 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%221997%20series%20%2353%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #54 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%221997%20series%20%2354%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #55 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%221997%20series%20%2355%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #56 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%221997%20series%20%2356%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #57 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%221997%20series%20%2357%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #58 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%221997%20series%20%2358%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #59 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%221997%20series%20%2359%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #60 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%221997%20series%20%2360%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #61 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%221997%20series%20%2361%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #62 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%221997%20series%20%2362%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #63 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%221997%20series%20%2363%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #64 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%221997%20series%20%2364%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #65 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%221997%20series%20%2365%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #66 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%221997%20series%20%2366%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #67 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%221997%20series%20%2367%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #68 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%221997%20series%20%2368%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #69 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%221997%20series%20%2369%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #70 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%221997%20series%20%2370%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

### `fantastic-four-017` — legacy #500-525

- [ ] #500 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22legacy%20%23500%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #501 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22legacy%20%23501%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #502 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22legacy%20%23502%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #503 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22legacy%20%23503%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #504 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22legacy%20%23504%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #505 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22legacy%20%23505%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #506 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22legacy%20%23506%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #507 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22legacy%20%23507%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #508 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22legacy%20%23508%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #509 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22legacy%20%23509%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #510 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22legacy%20%23510%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #511 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22legacy%20%23511%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #512 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22legacy%20%23512%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #513 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22legacy%20%23513%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #514 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22legacy%20%23514%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #515 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22legacy%20%23515%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #516 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22legacy%20%23516%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #517 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22legacy%20%23517%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #518 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22legacy%20%23518%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #519 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22legacy%20%23519%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #520 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22legacy%20%23520%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #521 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22legacy%20%23521%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #522 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22legacy%20%23522%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #523 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22legacy%20%23523%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #524 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22legacy%20%23524%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #525 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22legacy%20%23525%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

### `fantastic-four-018` — legacy #526-550

- [ ] #526 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22legacy%20%23526%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #527 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22legacy%20%23527%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #528 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22legacy%20%23528%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #529 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22legacy%20%23529%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #530 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22legacy%20%23530%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #531 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22legacy%20%23531%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #532 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22legacy%20%23532%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #533 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22legacy%20%23533%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #534 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22legacy%20%23534%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #535 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22legacy%20%23535%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #536 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22legacy%20%23536%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #537 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22legacy%20%23537%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #538 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22legacy%20%23538%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #539 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22legacy%20%23539%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #540 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22legacy%20%23540%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #541 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22legacy%20%23541%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #542 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22legacy%20%23542%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #543 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22legacy%20%23543%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #544 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22legacy%20%23544%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #545 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22legacy%20%23545%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #546 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22legacy%20%23546%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #547 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22legacy%20%23547%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #548 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22legacy%20%23548%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #549 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22legacy%20%23549%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #550 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22legacy%20%23550%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

### `fantastic-four-043` — legacy #551-575

- [ ] #551 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22legacy%20%23551%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #552 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22legacy%20%23552%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #553 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22legacy%20%23553%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #554 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22legacy%20%23554%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #555 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22legacy%20%23555%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #556 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22legacy%20%23556%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #557 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22legacy%20%23557%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #558 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22legacy%20%23558%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #559 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22legacy%20%23559%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #560 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22legacy%20%23560%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #561 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22legacy%20%23561%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #562 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22legacy%20%23562%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #563 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22legacy%20%23563%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #564 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22legacy%20%23564%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #565 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22legacy%20%23565%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #566 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22legacy%20%23566%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #567 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22legacy%20%23567%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #568 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22legacy%20%23568%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #569 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22legacy%20%23569%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #570 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22legacy%20%23570%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #571 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22legacy%20%23571%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #572 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22legacy%20%23572%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #573 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22legacy%20%23573%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #574 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22legacy%20%23574%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #575 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22legacy%20%23575%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

### `fantastic-four-046` — 2018 series #7-28

- [ ] #7 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%222018%20series%20%237%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #8 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%222018%20series%20%238%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #9 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%222018%20series%20%239%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #10 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%222018%20series%20%2310%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #11 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%222018%20series%20%2311%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #12 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%222018%20series%20%2312%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #13 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%222018%20series%20%2313%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #14 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%222018%20series%20%2314%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #15 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%222018%20series%20%2315%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #16 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%222018%20series%20%2316%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #17 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%222018%20series%20%2317%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #18 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%222018%20series%20%2318%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #19 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%222018%20series%20%2319%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #20 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%222018%20series%20%2320%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #21 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%222018%20series%20%2321%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #22 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%222018%20series%20%2322%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #23 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%222018%20series%20%2323%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #24 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%222018%20series%20%2324%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #25 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%222018%20series%20%2325%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #26 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%222018%20series%20%2326%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #27 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%222018%20series%20%2327%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #28 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%222018%20series%20%2328%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

### `fantastic-four-047` — 2018 series #29-48

- [ ] #29 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%222018%20series%20%2329%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #30 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%222018%20series%20%2330%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #31 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%222018%20series%20%2331%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #32 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%222018%20series%20%2332%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #33 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%222018%20series%20%2333%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #34 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%222018%20series%20%2334%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #35 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%222018%20series%20%2335%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #36 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%222018%20series%20%2336%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #37 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%222018%20series%20%2337%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #38 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%222018%20series%20%2338%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #39 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%222018%20series%20%2339%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #40 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%222018%20series%20%2340%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #41 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%222018%20series%20%2341%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #42 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%222018%20series%20%2342%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #43 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%222018%20series%20%2343%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #44 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%222018%20series%20%2344%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #45 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%222018%20series%20%2345%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #46 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%222018%20series%20%2346%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #47 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%222018%20series%20%2347%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #48 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%222018%20series%20%2348%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

### `fantastic-four-048` — 2022 series #1-13

- [ ] #1 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%222022%20series%20%231%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #2 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%222022%20series%20%232%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #3 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%222022%20series%20%233%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #4 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%222022%20series%20%234%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #5 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%222022%20series%20%235%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #6 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%222022%20series%20%236%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #7 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%222022%20series%20%237%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #8 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%222022%20series%20%238%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #9 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%222022%20series%20%239%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #10 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%222022%20series%20%2310%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #11 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%222022%20series%20%2311%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #12 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%222022%20series%20%2312%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #13 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%222022%20series%20%2313%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

### `fantastic-four-049` — 2022 series #14-33

- [ ] #14 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%222022%20series%20%2314%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #15 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%222022%20series%20%2315%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #16 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%222022%20series%20%2316%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #17 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%222022%20series%20%2317%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #18 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%222022%20series%20%2318%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #19 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%222022%20series%20%2319%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #20 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%222022%20series%20%2320%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #21 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%222022%20series%20%2321%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #22 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%222022%20series%20%2322%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #23 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%222022%20series%20%2323%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #24 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%222022%20series%20%2324%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #25 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%222022%20series%20%2325%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #26 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%222022%20series%20%2326%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #27 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%222022%20series%20%2327%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #28 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%222022%20series%20%2328%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #29 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%222022%20series%20%2329%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #30 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%222022%20series%20%2330%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #31 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%222022%20series%20%2331%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #32 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%222022%20series%20%2332%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #33 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%222022%20series%20%2333%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

### `fantastic-four-050` — 2025 series #1-18

- [ ] #1 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%222025%20series%20%231%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #2 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%222025%20series%20%232%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #3 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%222025%20series%20%233%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #4 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%222025%20series%20%234%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #5 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%222025%20series%20%235%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #6 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%222025%20series%20%236%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #7 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%222025%20series%20%237%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #8 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%222025%20series%20%238%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #9 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%222025%20series%20%239%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #10 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%222025%20series%20%2310%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #11 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%222025%20series%20%2311%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #12 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%222025%20series%20%2312%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #13 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%222025%20series%20%2313%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #14 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%222025%20series%20%2314%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #15 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%222025%20series%20%2315%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #16 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%222025%20series%20%2316%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #17 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%222025%20series%20%2317%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #18 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%222025%20series%20%2318%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

## X-family

### `new-mutants-001` — New Mutants #1-25

- [ ] #1 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22New%20Mutants%20%231%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #2 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22New%20Mutants%20%232%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #3 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22New%20Mutants%20%233%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #4 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22New%20Mutants%20%234%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #5 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22New%20Mutants%20%235%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #6 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22New%20Mutants%20%236%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #7 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22New%20Mutants%20%237%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #8 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22New%20Mutants%20%238%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #9 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22New%20Mutants%20%239%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #10 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22New%20Mutants%20%2310%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #11 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22New%20Mutants%20%2311%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #12 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22New%20Mutants%20%2312%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #13 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22New%20Mutants%20%2313%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #14 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22New%20Mutants%20%2314%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #15 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22New%20Mutants%20%2315%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #16 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22New%20Mutants%20%2316%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #17 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22New%20Mutants%20%2317%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #18 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22New%20Mutants%20%2318%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #19 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22New%20Mutants%20%2319%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #20 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22New%20Mutants%20%2320%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #21 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22New%20Mutants%20%2321%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #22 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22New%20Mutants%20%2322%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #23 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22New%20Mutants%20%2323%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #24 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22New%20Mutants%20%2324%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #25 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22New%20Mutants%20%2325%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

### `new-mutants-002` — New Mutants #26-50

- [ ] #26 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22New%20Mutants%20%2326%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #27 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22New%20Mutants%20%2327%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #28 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22New%20Mutants%20%2328%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #29 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22New%20Mutants%20%2329%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #30 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22New%20Mutants%20%2330%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #31 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22New%20Mutants%20%2331%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #32 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22New%20Mutants%20%2332%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #33 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22New%20Mutants%20%2333%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #34 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22New%20Mutants%20%2334%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #35 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22New%20Mutants%20%2335%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #36 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22New%20Mutants%20%2336%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #37 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22New%20Mutants%20%2337%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #38 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22New%20Mutants%20%2338%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #39 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22New%20Mutants%20%2339%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #40 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22New%20Mutants%20%2340%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #41 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22New%20Mutants%20%2341%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #42 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22New%20Mutants%20%2342%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #43 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22New%20Mutants%20%2343%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #44 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22New%20Mutants%20%2344%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #45 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22New%20Mutants%20%2345%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #46 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22New%20Mutants%20%2346%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #47 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22New%20Mutants%20%2347%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #48 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22New%20Mutants%20%2348%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #49 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22New%20Mutants%20%2349%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #50 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22New%20Mutants%20%2350%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

### `new-mutants-003` — New Mutants #51-75

- [ ] #51 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22New%20Mutants%20%2351%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #52 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22New%20Mutants%20%2352%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #53 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22New%20Mutants%20%2353%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #54 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22New%20Mutants%20%2354%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #55 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22New%20Mutants%20%2355%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #56 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22New%20Mutants%20%2356%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #57 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22New%20Mutants%20%2357%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #58 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22New%20Mutants%20%2358%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #59 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22New%20Mutants%20%2359%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #60 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22New%20Mutants%20%2360%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #61 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22New%20Mutants%20%2361%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #62 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22New%20Mutants%20%2362%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #63 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22New%20Mutants%20%2363%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #64 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22New%20Mutants%20%2364%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #65 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22New%20Mutants%20%2365%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #66 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22New%20Mutants%20%2366%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #67 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22New%20Mutants%20%2367%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #68 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22New%20Mutants%20%2368%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #69 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22New%20Mutants%20%2369%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #70 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22New%20Mutants%20%2370%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #71 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22New%20Mutants%20%2371%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #72 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22New%20Mutants%20%2372%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #73 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22New%20Mutants%20%2373%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #74 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22New%20Mutants%20%2374%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #75 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22New%20Mutants%20%2375%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

### `new-mutants-004` — New Mutants #76-100

- [ ] #76 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22New%20Mutants%20%2376%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #77 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22New%20Mutants%20%2377%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #78 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22New%20Mutants%20%2378%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #79 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22New%20Mutants%20%2379%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #80 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22New%20Mutants%20%2380%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #81 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22New%20Mutants%20%2381%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #82 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22New%20Mutants%20%2382%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #83 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22New%20Mutants%20%2383%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #84 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22New%20Mutants%20%2384%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #85 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22New%20Mutants%20%2385%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #86 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22New%20Mutants%20%2386%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #87 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22New%20Mutants%20%2387%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #88 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22New%20Mutants%20%2388%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #89 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22New%20Mutants%20%2389%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #90 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22New%20Mutants%20%2390%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #91 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22New%20Mutants%20%2391%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #92 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22New%20Mutants%20%2392%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #93 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22New%20Mutants%20%2393%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #94 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22New%20Mutants%20%2394%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #95 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22New%20Mutants%20%2395%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #96 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22New%20Mutants%20%2396%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #97 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22New%20Mutants%20%2397%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #98 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22New%20Mutants%20%2398%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #99 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22New%20Mutants%20%2399%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #100 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22New%20Mutants%20%23100%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

### `x-men-001` — Uncanny X-Men #126-150

- [ ] #126 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23126%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #127 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23127%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #128 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23128%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #129 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23129%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #130 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23130%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #131 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23131%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #132 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23132%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #133 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23133%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #134 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23134%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #135 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23135%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #136 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23136%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #137 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23137%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #138 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23138%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #139 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23139%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #140 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23140%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #141 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23141%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #142 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23142%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #143 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23143%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #144 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23144%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #145 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23145%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #146 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23146%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #147 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23147%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #148 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23148%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #149 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23149%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #150 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23150%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

### `x-men-002` — Uncanny X-Men #151-175

- [ ] #151 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23151%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #152 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23152%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #153 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23153%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #154 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23154%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #155 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23155%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #156 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23156%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #157 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23157%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #158 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23158%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #159 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23159%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #160 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23160%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #161 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23161%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #162 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23162%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #163 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23163%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #164 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23164%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #165 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23165%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #166 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23166%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #167 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23167%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #168 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23168%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #169 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23169%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #170 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23170%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #171 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23171%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #172 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23172%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #173 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23173%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #174 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23174%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #175 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23175%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

### `x-men-003` — Uncanny X-Men #176-200

- [ ] #176 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23176%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #177 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23177%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #178 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23178%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #179 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23179%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #180 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23180%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #181 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23181%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #182 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23182%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #183 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23183%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #184 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23184%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #185 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23185%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #186 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23186%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #187 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23187%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #188 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23188%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #189 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23189%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #190 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23190%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #191 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23191%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #192 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23192%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #193 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23193%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #194 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23194%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #195 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23195%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #196 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23196%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #197 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23197%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #198 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23198%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #199 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23199%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #200 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23200%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

### `x-men-004` — Uncanny X-Men #201-225

- [ ] #201 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23201%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #202 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23202%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #203 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23203%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #204 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23204%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #205 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23205%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #206 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23206%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #207 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23207%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #208 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23208%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #209 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23209%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #210 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23210%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #211 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23211%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #212 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23212%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #213 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23213%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #214 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23214%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #215 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23215%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #216 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23216%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #217 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23217%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #218 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23218%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #219 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23219%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #220 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23220%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #221 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23221%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #222 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23222%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #223 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23223%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #224 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23224%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #225 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23225%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

### `x-men-005` — Uncanny X-Men #226-250

- [ ] #226 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23226%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #227 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23227%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #228 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23228%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #229 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23229%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #230 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23230%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #231 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23231%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #232 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23232%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #233 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23233%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #234 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23234%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #235 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23235%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #236 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23236%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #237 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23237%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #238 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23238%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #239 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23239%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #240 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23240%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #241 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23241%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #242 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23242%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #243 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23243%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #244 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23244%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #245 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23245%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #246 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23246%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #247 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23247%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #248 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23248%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #249 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23249%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #250 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23250%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

### `x-men-006` — Uncanny X-Men #251-275

- [ ] #251 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23251%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #252 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23252%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #253 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23253%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #254 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23254%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #255 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23255%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #256 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23256%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #257 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23257%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #258 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23258%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #259 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23259%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #260 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23260%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #261 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23261%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #262 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23262%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #263 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23263%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #264 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23264%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #265 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23265%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #266 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23266%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #267 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23267%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #268 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23268%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #269 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23269%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #270 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23270%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #271 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23271%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #272 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23272%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #273 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23273%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #274 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23274%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #275 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23275%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

### `x-men-007` — Uncanny X-Men #276-300

- [ ] #276 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23276%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #277 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23277%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #278 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23278%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #279 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23279%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #280 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23280%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #281 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23281%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #282 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23282%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #283 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23283%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #284 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23284%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #285 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23285%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #286 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23286%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #287 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23287%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #288 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23288%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #289 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23289%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #290 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23290%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #291 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23291%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #292 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23292%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #293 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23293%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #294 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23294%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #295 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23295%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #296 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23296%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #297 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23297%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #298 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23298%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #299 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23299%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #300 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Uncanny%20X-Men%20%23300%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

### `excalibur-001` — Excalibur #1-25

- [ ] #1 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Excalibur%20%231%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #2 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Excalibur%20%232%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #3 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Excalibur%20%233%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #4 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Excalibur%20%234%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #5 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Excalibur%20%235%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #6 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Excalibur%20%236%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #7 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Excalibur%20%237%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #8 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Excalibur%20%238%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #9 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Excalibur%20%239%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #10 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Excalibur%20%2310%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #11 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Excalibur%20%2311%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #12 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Excalibur%20%2312%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #13 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Excalibur%20%2313%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #14 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Excalibur%20%2314%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #15 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Excalibur%20%2315%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #16 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Excalibur%20%2316%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #17 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Excalibur%20%2317%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #18 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Excalibur%20%2318%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #19 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Excalibur%20%2319%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #20 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Excalibur%20%2320%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #21 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Excalibur%20%2321%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #22 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Excalibur%20%2322%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #23 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Excalibur%20%2323%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #24 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Excalibur%20%2324%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #25 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Excalibur%20%2325%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

### `excalibur-002` — Excalibur #26-50

- [ ] #26 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Excalibur%20%2326%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #27 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Excalibur%20%2327%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #28 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Excalibur%20%2328%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #29 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Excalibur%20%2329%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #30 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Excalibur%20%2330%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #31 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Excalibur%20%2331%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #32 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Excalibur%20%2332%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #33 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Excalibur%20%2333%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #34 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Excalibur%20%2334%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #35 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Excalibur%20%2335%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #36 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Excalibur%20%2336%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #37 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Excalibur%20%2337%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #38 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Excalibur%20%2338%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #39 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Excalibur%20%2339%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #40 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Excalibur%20%2340%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #41 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Excalibur%20%2341%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #42 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Excalibur%20%2342%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #43 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Excalibur%20%2343%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #44 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Excalibur%20%2344%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #45 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Excalibur%20%2345%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #46 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Excalibur%20%2346%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #47 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Excalibur%20%2347%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #48 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Excalibur%20%2348%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #49 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Excalibur%20%2349%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #50 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Excalibur%20%2350%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

### `excalibur-003` — Excalibur #51-75

- [ ] #51 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Excalibur%20%2351%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #52 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Excalibur%20%2352%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #53 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Excalibur%20%2353%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #54 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Excalibur%20%2354%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #55 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Excalibur%20%2355%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #56 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Excalibur%20%2356%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #57 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Excalibur%20%2357%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #58 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Excalibur%20%2358%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #59 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Excalibur%20%2359%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #60 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Excalibur%20%2360%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #61 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Excalibur%20%2361%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #62 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Excalibur%20%2362%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #63 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Excalibur%20%2363%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #64 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Excalibur%20%2364%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #65 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Excalibur%20%2365%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #66 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Excalibur%20%2366%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #67 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Excalibur%20%2367%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #68 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Excalibur%20%2368%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #69 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Excalibur%20%2369%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #70 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Excalibur%20%2370%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #71 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Excalibur%20%2371%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #72 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Excalibur%20%2372%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #73 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Excalibur%20%2373%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #74 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Excalibur%20%2374%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #75 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Excalibur%20%2375%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

## Marvel specials

### `earth-x-001` — Earth X #0-12

- [ ] #0 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Earth%20X%20%230%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #1 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Earth%20X%20%231%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #2 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Earth%20X%20%232%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #3 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Earth%20X%20%233%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #4 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Earth%20X%20%234%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #5 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Earth%20X%20%235%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #6 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Earth%20X%20%236%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #7 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Earth%20X%20%237%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #8 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Earth%20X%20%238%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #9 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Earth%20X%20%239%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #10 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Earth%20X%20%2310%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #11 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Earth%20X%20%2311%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #12 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Earth%20X%20%2312%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

### `ultimate-spider-man-001` — Ultimate Spider-Man #1-24

- [ ] #1 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Ultimate%20Spider-Man%20%231%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #2 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Ultimate%20Spider-Man%20%232%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #3 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Ultimate%20Spider-Man%20%233%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #4 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Ultimate%20Spider-Man%20%234%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #5 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Ultimate%20Spider-Man%20%235%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #6 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Ultimate%20Spider-Man%20%236%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #7 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Ultimate%20Spider-Man%20%237%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #8 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Ultimate%20Spider-Man%20%238%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #9 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Ultimate%20Spider-Man%20%239%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #10 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Ultimate%20Spider-Man%20%2310%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #11 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Ultimate%20Spider-Man%20%2311%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #12 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Ultimate%20Spider-Man%20%2312%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #13 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Ultimate%20Spider-Man%20%2313%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #14 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Ultimate%20Spider-Man%20%2314%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #15 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Ultimate%20Spider-Man%20%2315%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #16 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Ultimate%20Spider-Man%20%2316%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #17 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Ultimate%20Spider-Man%20%2317%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #18 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Ultimate%20Spider-Man%20%2318%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #19 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Ultimate%20Spider-Man%20%2319%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #20 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Ultimate%20Spider-Man%20%2320%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #21 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Ultimate%20Spider-Man%20%2321%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #22 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Ultimate%20Spider-Man%20%2322%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #23 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Ultimate%20Spider-Man%20%2323%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #24 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Ultimate%20Spider-Man%20%2324%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

### `ultimates-001` — Ultimates #1-24

- [ ] #1 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Ultimates%20%231%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #2 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Ultimates%20%232%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #3 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Ultimates%20%233%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #4 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Ultimates%20%234%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #5 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Ultimates%20%235%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #6 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Ultimates%20%236%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #7 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Ultimates%20%237%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #8 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Ultimates%20%238%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #9 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Ultimates%20%239%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #10 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Ultimates%20%2310%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #11 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Ultimates%20%2311%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #12 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Ultimates%20%2312%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #13 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Ultimates%20%2313%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #14 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Ultimates%20%2314%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #15 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Ultimates%20%2315%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #16 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Ultimates%20%2316%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #17 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Ultimates%20%2317%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #18 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Ultimates%20%2318%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #19 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Ultimates%20%2319%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #20 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Ultimates%20%2320%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #21 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Ultimates%20%2321%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #22 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Ultimates%20%2322%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #23 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Ultimates%20%2323%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #24 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22Ultimates%20%2324%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

## Marvel licensed titles

### `indiana-jones-001` — The Further Adventures of Indiana Jones #1-17

- [ ] #1 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22The%20Further%20Adventures%20of%20Indiana%20Jones%20%231%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #2 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22The%20Further%20Adventures%20of%20Indiana%20Jones%20%232%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #3 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22The%20Further%20Adventures%20of%20Indiana%20Jones%20%233%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #4 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22The%20Further%20Adventures%20of%20Indiana%20Jones%20%234%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #5 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22The%20Further%20Adventures%20of%20Indiana%20Jones%20%235%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #6 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22The%20Further%20Adventures%20of%20Indiana%20Jones%20%236%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #7 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22The%20Further%20Adventures%20of%20Indiana%20Jones%20%237%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #8 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22The%20Further%20Adventures%20of%20Indiana%20Jones%20%238%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #9 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22The%20Further%20Adventures%20of%20Indiana%20Jones%20%239%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #10 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22The%20Further%20Adventures%20of%20Indiana%20Jones%20%2310%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #11 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22The%20Further%20Adventures%20of%20Indiana%20Jones%20%2311%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #12 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22The%20Further%20Adventures%20of%20Indiana%20Jones%20%2312%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #13 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22The%20Further%20Adventures%20of%20Indiana%20Jones%20%2313%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #14 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22The%20Further%20Adventures%20of%20Indiana%20Jones%20%2314%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #15 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22The%20Further%20Adventures%20of%20Indiana%20Jones%20%2315%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #16 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22The%20Further%20Adventures%20of%20Indiana%20Jones%20%2316%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #17 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22The%20Further%20Adventures%20of%20Indiana%20Jones%20%2317%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

### `indiana-jones-002` — The Further Adventures of Indiana Jones #18-34

- [ ] #18 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22The%20Further%20Adventures%20of%20Indiana%20Jones%20%2318%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #19 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22The%20Further%20Adventures%20of%20Indiana%20Jones%20%2319%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #20 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22The%20Further%20Adventures%20of%20Indiana%20Jones%20%2320%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #21 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22The%20Further%20Adventures%20of%20Indiana%20Jones%20%2321%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #22 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22The%20Further%20Adventures%20of%20Indiana%20Jones%20%2322%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #23 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22The%20Further%20Adventures%20of%20Indiana%20Jones%20%2323%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #24 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22The%20Further%20Adventures%20of%20Indiana%20Jones%20%2324%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #25 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22The%20Further%20Adventures%20of%20Indiana%20Jones%20%2325%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #26 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22The%20Further%20Adventures%20of%20Indiana%20Jones%20%2326%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #27 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22The%20Further%20Adventures%20of%20Indiana%20Jones%20%2327%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #28 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22The%20Further%20Adventures%20of%20Indiana%20Jones%20%2328%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #29 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22The%20Further%20Adventures%20of%20Indiana%20Jones%20%2329%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #30 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22The%20Further%20Adventures%20of%20Indiana%20Jones%20%2330%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #31 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22The%20Further%20Adventures%20of%20Indiana%20Jones%20%2331%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #32 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22The%20Further%20Adventures%20of%20Indiana%20Jones%20%2332%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #33 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22The%20Further%20Adventures%20of%20Indiana%20Jones%20%2333%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:

- [ ] #34 — [find official issue page](https://www.google.com/search?q=site%3Amarvel.com%2Fcomics%2Fissue%20%22The%20Further%20Adventures%20of%20Indiana%20Jones%20%2334%22)
  - Official Marvel page URL:
  - Direct cover URL:
  - Notes:
