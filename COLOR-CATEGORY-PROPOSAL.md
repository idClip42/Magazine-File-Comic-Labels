# Proposed Simplified Color Categories

## Recommendation

Use **nine shelf-level color families**, not one color per title.  The color is
the first-distance signal: it should tell you where a box belongs on the wall,
while the logo and years identify the specific series.  This reduces the current
89-box / 26-color system to a small, repeatable vocabulary and lets adjacent
related boxes create deliberate fields of color.

The existing Fantastic Four blue already proves the principle.  The proposed
system keeps that strong field, turns the currently separate New Mutants,
Uncanny X-Men, Excalibur, and Wolverine colors into one X-family field, and
gives the incoming Spider-Man, Ultimate, and DC boxes clear homes.

| Family                | Token             | Color     | Scope                                      |
| --------------------- | ----------------- | --------- | ------------------------------------------ |
| Fantastic Four        | `ff-blue`         | `#78A9FF` | FF-related books                           |
| X-family              | `x-gold`          | `#D99B22` | X-Men, New Mutants, Excalibur, Wolverine   |
| Spider-family         | `spider-red`      | `#B32A32` | Spider-Man and adjacent books              |
| Ultimate Universe     | `ultimate-slate`  | `#596B78` | All Ultimate-universe books                |
| Marvel Universe       | `marvel-violet`   | `#66508A` | Marvel books outside the families above    |
| DC Universe           | `dc-indigo`       | `#315A9B` | DC books                                   |
| Adventure & pulp      | `adventure-umber` | `#9A6536` | Indy, 007, Quest, League, Shadow           |
| Horror & dark fantasy | `dark-plum`       | `#4D3D59` | Aliens, Army of Darkness, Fatale, monsters |
| Other / provisional   | `archive-gray`    | `#73777B` | Temporary home for true one-offs           |

The intended shelf read is: large FF, X, Spider, Marvel, and DC fields, with
smaller Ultimate, adventure, and horror fields. The title logo, art, and years
continue to distinguish individual boxes.

## What this changes in the current inventory

The change is structural, not a loss of series identity.  Each box still gets
its own era-appropriate logo, artwork, title, issue range, and years; it simply
inherits one family token rather than owning a title-specific hex value.

| Current category                                     | New family            |
| ---------------------------------------------------- | --------------------- |
| FF-related titles                                    | Fantastic Four        |
| X-Men, New Mutants, Excalibur, Wolverine             | X-family              |
| Spider-Man, Black Cat, Marvel Team-Up                | Spider-family         |
| Ultimate Fantastic Four and planned Ultimate titles  | Ultimate Universe     |
| Remaining Marvel titles and Jessica Jones            | Marvel Universe       |
| Batman, Superman, Titans, Young Justice              | DC Universe           |
| Indy, Quest, 007, League, Shadow                     | Adventure & pulp      |
| Aliens, Army of Darkness, Fatale, Universal Monsters | Horror & dark fantasy |

## Deliberate future exceptions

Do not create a new family merely because a title has a famous associated color.
Add one only when it will form a meaningful shelf field: roughly **three or more
physical boxes now, or a well-supported near-term expansion**.  This leaves room
for two useful future families without pre-emptively adding color noise:

| Future family    | Token           | Color     | Introduce when             |
| ---------------- | --------------- | --------- | -------------------------- |
| Avengers / teams | `avengers-gold` | `#C69A28` | Three or more team boxes   |
| Hulk / gamma     | `gamma-green`   | `#4C8B57` | A visible Hulk-focused run |

Until then, these titles belong in Marvel violet.  In particular, keep
**She-Hulk in Marvel violet** at first: moving a single two-box title to green
would reintroduce exactly the isolated color accent this proposal is meant to
remove.

## Application rules

1. Store the nine colors as family-level tokens in `config/categories.json` (or
   a dedicated palette section), then have individual title categories reference
   the token. Do not repeat hex values per series.
2. Apply the family color to the header rules, logo treatment, artwork tint, and
   any small category marker. The white identity and metadata bands remain the
   shared architecture across every box.
3. Keep a title's name and historical logo independent of its color. For
   example, an Excalibur box can still use its recognizable logo while reading
   as part of the larger X-family field.
4. Put related boxes together physically where practical. The visual system
   will read best as broad FF, X, Spider, Marvel, and DC runs, with the smaller
   genre families grouped rather than dispersed one box at a time.
5. Proof the nine tints on the actual matte vinyl before committing. They should
   be similar in perceived darkness after the shared art treatment; very pale
   yellow and high-saturation red are especially likely to behave differently in
   print than on screen.

## Why this is the right level of simplification

The proposal preserves the distinctions that are useful at shelf distance:
Fantastic Four, X, Spider, Ultimate, Marvel, DC, adventure, and horror. It
removes distinctions that only add visual static at that distance, such as a
separate color for a single Black Cat, Doctor Strange, Jonny Quest, or Shadow
box. It also gives every confirmed planned label a destination now, while
reserving new colors for future collections large enough to earn them.
