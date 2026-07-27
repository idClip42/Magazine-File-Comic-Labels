# Proposed Simplified Color Categories

## Recommendation

Use **seven shelf-level color families**, not one color per title. The color is
the first-distance signal: it should tell you where a box belongs on the wall,
while the logo and years identify the specific series.  This reduces the current
89-box / 26-color system to a small vocabulary and lets adjacent
related boxes create deliberate fields of color.

The existing Fantastic Four blue already proves the principle.  The proposed
system keeps that strong field, turns the currently separate New Mutants,
Uncanny X-Men, Excalibur, and Wolverine colors into one X-family field, and
gives the incoming Spider-Man, Ultimate, and DC boxes clear homes.

| Family                | Token             | Color     | Scope                                      |
| --------------------- | ----------------- | --------- | ------------------------------------------ |
| Fantastic Four        | `ff-blue`         | `#78A9FF` | FF-related books                           |
| X-family              | `x-gold`          | `#D99B22` | X-Men, New Mutants, Excalibur, Wolverine   |
| Marvel characters     | `marvel-red`      | `#B32A32` | Marvel character and team books            |
| Marvel specials       | `marvel-orange`   | `#C65E32` | Events, reference, alternate history       |
| DC Universe           | `dc-indigo`       | `#315A9B` | DC books                                   |
| Adventure & pulp      | `adventure-umber` | `#9A6536` | Indy, 007, Quest, League, Shadow           |
| Horror & dark fantasy | `dark-plum`       | `#4D3D59` | Aliens, Army of Darkness, Fatale, monsters |

The intended shelf read is: large FF, X, Marvel, and DC fields, plus smaller
Marvel-specials, adventure, and horror fields. Marvel red and Marvel orange are
a deliberate warm pair: related, but distinct enough to separate character/team
books from special-format books. The title logo, art, and years continue to
distinguish individual boxes. The FF blue is light and cyan-leaning; DC indigo
is dark and blue-violet. They should read as different fields even when they
meet on a shelf.

## What this changes in the current inventory

The change is structural, not a loss of series identity.  Each box still gets
its own era-appropriate logo, artwork, title, issue range, and years; it simply
inherits one family token rather than owning a title-specific hex value.

| Current category                                      | New family            |
| ----------------------------------------------------- | --------------------- |
| FF-related titles                                     | Fantastic Four        |
| X-Men, New Mutants, Excalibur, Wolverine              | X-family              |
| Spider-Man, Black Cat, Marvel Team-Up                 | Marvel characters     |
| Ultimate Fantastic Four and planned Ultimate titles   | Marvel characters     |
| She-Hulk, Iron Man, Daredevil, Strange, Jessica Jones | Marvel characters     |
| Secret Wars, What If...?, Handbook, Marvel Fanfare    | Marvel specials       |
| Batman, Superman, Titans, Young Justice               | DC Universe           |
| Indy, Quest, 007, League, Shadow                      | Adventure & pulp      |
| Aliens, Army of Darkness, Fatale, Universal Monsters  | Horror & dark fantasy |

## Application rules

1. Store the seven colors as family-level tokens in `config/categories.json` (or
   a dedicated palette section), then have individual title categories reference
   the token. Do not repeat hex values per series.
2. Apply the family color to the header rules, logo treatment, artwork tint, and
   any small category marker. The white identity and metadata bands remain the
   shared architecture across every box.
3. Keep a title's name and historical logo independent of its color. For
   example, an Excalibur box can still use its recognizable logo while reading
   as part of the larger X-family field.
4. Put related boxes together physically where practical. The visual system
   will read best as broad FF, X, Marvel, and DC runs, with smaller genre
   families grouped rather than dispersed one box at a time.
5. Proof the seven tints on the actual matte vinyl before committing. They should
   be similar in perceived darkness after the shared art treatment; very pale
   yellow and high-saturation red are especially likely to behave differently in
   print than on screen.

## Why this is the right level of simplification

The proposal preserves the useful shelf-distance distinctions: Fantastic Four,
X, Marvel characters, Marvel specials, DC, adventure, and horror. It removes
the title-by-title variation that creates visual static, while giving every
confirmed planned label a home now.
