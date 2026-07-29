# TODO

- [x] We actually do need edge/bleed guides to help position the art
- [x] Save pulled remote artwork in `dist/artwork-cache/`, indexed by source URL
  - The crop editor loads cached files into memory on later starts and downloads only cache misses.
  - The cache is deliberately gitignored with `dist/`; delete `dist/artwork-cache/` to refresh remote artwork.
- [x] Ability to have multiple options for a label, and cycle through them in the UI
  - Would it be a bridge too far to ask Codex to supply the links to the official marvel image files? To look at the pattern for the "clean.jpg" pics and find all of them?
    - If I google "Marvel Fantastic Four" and then the issue number, one of the first results is the official marvel page for it, which seems like the way to the hi res image.
  - Candidate URLs stay as a compact list on the label. The editor keeps a temporary crop for each candidate during the current session and saves only the selected image and crop.
  - Numbered cover-thumbnail buttons appear only for labels with candidates; all candidates are preloaded into the local editor cache at startup.
  - I imagine it'd be similar for New Mutants, X-Men, Excalibur... Further Adventures of Indiana Jones...
    - Basically any Marvel comic where I've established a clear series.
  - The Marvel wikia is also a source for cover art, and I've occasionally found cover art there that's bigger than what the official marvel website has, so that's an option for searching too I guess.
- [x] Prevent accidental artwork zoom while scrolling
  - Zoom requires Ctrl/Cmd + scroll; normal scrolling is left alone.
  - Left or middle mouse-button drag pans artwork.
- [x] Worth noting in the docs - I had wanted to start picking out individual panel art, but I'm finding it suddenly very difficult to get at hi res versions of these comics on pirate websites, so I think we're stuck with close-ups on covers.
- [x] Two labels should never have the same art, but if they do, in the UI, if I go to move the second one, it moves the first instead, which is bug behavior.
