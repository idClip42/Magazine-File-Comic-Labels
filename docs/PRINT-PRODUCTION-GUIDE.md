# Label print-production guide

This guide records the practical production paths considered for the V2 comic
magazine-file labels. It is a decision and shopping guide, not a replacement
for the design brief in `docs/design/DESIGN-V2.md`.

## Current decision

V2 is a deliberately lower-commitment real-world test:

- Apply labels to the existing IKEA/cardboard magazine files, including the
  slightly worn ones.
- Use matte printable vinyl if printing at home, but **do not laminate V2**.
- Prefer removable adhesive for the V2 home-print experiment, subject to a
  physical adhesion test.
- Treat V3 as the possible final-production version: choose replacement files
  only after measuring shelf clearance, then reconsider permanent adhesive,
  matte laminate, and professional production.

The reasons to skip laminate for V2 are valid: the files are not final, labels
will mostly sit tightly together on shelves, and hand laminating would add a
substantial repeated craft step to the project.

## Physical specification

The configured dimensions are in `config/layout.json`.

| Item | Measurement |
| --- | ---: |
| Visible front face | 3.875 x 11.75 in |
| Side overwrap | 0.5 in on each side |
| Finished label material | **4.875 x 11.75 in** |
| Current label count | 116 |
| Total finished vinyl area | 46.14 sq ft |

For home printing, two labels fit side-by-side on one 11 x 17 in (tabloid)
sheet. The set therefore needs 58 printed sheets before proofs and spares.
Always print at **100% / actual size**; do not use a printer dialog's
"fit to page" option.

## Path A: professional vinyl print

[Platypus Printing's "Printed Adhesive Vinyl by the Square Foot"](https://platypusprinting.com/products/vinyl-by-the-sqft)
is a promising service because it prices material by area and accepts
multi-page PDFs, rather than treating every unique cover as a separate sticker
order.

An explored one-page grid is approximately 83 x 82 in (17 labels across by 7
rows, with three spare positions). It was quoted at approximately **$245** for
Premium Vinyl (Air-Release) with matte laminate, before tax and shipping, as
observed on 2026-08-06. The Economy Vinyl quote was approximately $237.
Prices must be rechecked at purchase time.

Large sheets are normally shipped rolled in a long tube or box; ask the printer
whether the artwork will arrive as one panel or tiled panels, how it will be
shipped, and whether they can add cut marks. Never allow laminated vinyl to be
folded.

### Recommended professional specification

> Full-color white permanent adhesive vinyl, **matte laminate**, 116 unique
> rectangular labels at 4.875 x 11.75 in finished size. Supply one print-ready
> PDF as a gang sheet or multi-page file. Request straight trim/cut marks only:
> no contour cutting, retail packaging, or vehicle-wrap-grade upgrade.

For the Platypus choice, Premium Vinyl is the sensible default for the small
price difference: its air-release adhesive makes hand application more
forgiving. Ask for the exact film and adhesive specification and whether it is
recommended for clean coated-cardboard files. Air-release film helps release
application bubbles; it does not repair rough, dusty, or fuzzy cardboard.

### Proof before a full professional order

Order or otherwise make a small proof set first. Include:

1. A normal file.
2. The roughest file.
3. A label with a side overwrap.
4. A file on a shelf with tight top clearance.
5. One of the least-sharp-looking cover images.

Check actual size, image resolution, color, adhesion after a week, and edge
wear from the shelf before committing to a whole production run.

## Path B: home-print V2 (no laminate)

This is appropriate only if a suitable wide-format inkjet printer is already
owned or is being purchased for broader creative use. It does not beat the
professional quote when buying a printer solely for these labels.

### Materials

1. **11 x 17 in matte white printable vinyl for inkjet printers.** It needs a
   permanent or removable adhesive backing and a paper release liner. Do not
   buy heat-transfer vinyl or ordinary paper sticker stock.
2. A wide-format inkjet printer capable of tabloid (11 x 17 in) or larger
   media. See the future printer-decision section below.
3. A felt-edged squeegee or plastic application card.
4. A rotary trimmer or a metal ruler and fresh craft knife.
5. A clean, flat work surface.

One researched example was a 100-sheet, 11 x 17 in matte removable printable
vinyl pack at $76.63. At two labels per sheet, it supplies the 58 production
sheets plus 42 sheets for proofs, errors, and replacements. This is a current
price example, not a required product or an endorsement of its specific
adhesive.

### Adhesive choice for V2

Removable adhesive is reasonable for a test on existing cardboard files. It
makes later replacement less painful. Its risk is edge lift, particularly on
side wraps, rough cardboard, dust, and frequently handled files.

Do not assume that a marketplace listing's use of "waterproof" proves long-term
adhesion or print durability. Make four representative test labels first:

- a wrapped label;
- a label on the worst cardboard;
- a frequently handled file; and
- a file on a shelf with tight top clearance.

Clean loose dust from the files, let them dry completely, and apply at normal
room temperature. Evaluate them after one week. The shelf arrangement will
protect side edges somewhat because files are normally pressed together.

### Workflow

1. Create a two-up 11 x 17 in print PDF, with each finished label at 4.875 x
   11.75 in. This needs proper 100%-scale output; do not silently shrink labels
   to fit a page.
2. Print a handful of representative sheets first, at the intended quality and
   on the actual vinyl.
3. Inspect image sharpness at the real label size. A vendor preview or a
   zoomed-out giant PDF preview is not a reliable resolution test.
4. Apply the test labels to actual files and wait one week.
5. Print the remaining sheets only if the tests pass.
6. Cut labels precisely and apply them from one edge downward, pressing with a
   card to avoid bubbles.
7. Keep the unused sheets for future replacements or catalog additions.

### V2 home-print budget (excluding printer)

| Item | Working budget |
| --- | ---: |
| 100 11 x 17 printable-vinyl sheets | about $77 |
| Ink used for this project | roughly $15–$35 |
| Squeegee/trimmer/blades, if needed | roughly $20–$40 |
| **V2 consumables total** | **about $110–$150** |

This route leaves the printed surface exposed. It should still look good on a
shelf, but it will be more vulnerable to scuffs, fingerprints, moisture, and
ink abrasion than a laminated label.

## Matte laminate: retain this for V3 or a later home-print run

Lamination is a clear, pressure-sensitive film placed **over the printed face**
of the printable vinyl. It is not the same as office thermal-lamination pouches
and does not require a laminating machine.

```text
clear matte cold laminate
printed ink
matte white adhesive vinyl
release liner
```

### What it changes

**With no laminate:** the printable vinyl is already a matte sticker. It can
look excellent but the ink-receiving surface is exposed to rubbing, oils,
scratches, and moisture.

**With matte laminate:** the surface becomes more wipeable, scratch-resistant,
and professionally finished. It cuts glare and fingerprints. Matte film can
slightly soften microscopic detail and mute saturation, but is usually the
better shelf finish. It does not make a low-resolution cover image sharper.

### The labor trade-off

Manual cold lamination means applying a thin adhesive plastic film smoothly to
each printed sheet. For this set that is about 58 two-label sheets. The basic
process is:

1. Lay the dry printed sheet face-up.
2. Align the laminate at one edge.
3. Peel back a small section of the laminate liner.
4. Squeegee from the center outward while gradually removing the liner.
5. Cut the laminated sheet into labels.

Expect several hours of focused repetitive work and some test waste. Dust,
bubbles, wrinkles, and misalignment are the normal failure modes. This is the
main reason not to add laminate to V2.

### Material math for a future laminated home-print run

A 12 in wide matte self-adhesive laminate roll can cover the 11.75 in label
height. Laminate two labels side-by-side under the same 12 in strip:

```text
12 in roll width
┌───────────────────┐
│   label | label   │
└───────────────────┘
```

The full set needs about 47 linear ft of 12 in-wide laminate. Two 12 in x 30 ft
matte rolls provide 60 linear ft, leaving useful test/spare material. A
researched price for that format was about $15.99 per roll, or about $32 for two
rolls. Verify that the chosen listing is explicitly **matte**: retailers often
group glossy and matte variants under similar product pages.

The 12 in x 15 ft rolls are physically suitable but would require four rolls
for the same 60 ft total and can cost materially more. A 25 in x 1,102 in
($89.99) cold-laminate roll is technically usable but excessive and awkward for
this project: it contains about 191 sq ft of material for a set needing roughly
50 sq ft after normal waste.

### Future laminated home-print budget (excluding printer)

| Item | Working budget |
| --- | ---: |
| 100 11 x 17 printable-vinyl sheets | about $77 |
| Two 12 in x 30 ft matte cold-laminate rolls | about $32 |
| Ink used | roughly $15–$35 |
| Tools and test waste | roughly $20–$40 |
| **Consumables total** | **about $145–$185** |

## Printer decision: requirements and current shortlist

Do not buy a printer *solely* to produce V2; the professional vinyl order is
still less expensive than buying one. The case for ownership is the ability to
make a replacement, correction, or new label at any time, plus ordinary home
printing and scanning over many years.

### What the printer needs to do

| Requirement | Why it matters here |
| --- | --- |
| **13 x 19 in (A3+) printing** | 11 x 17 works two-up for these labels; 13 x 19 gives more layout freedom and is the useful long-term wide-format tier. |
| **Rear or specialty-media feed** | Printable vinyl is thicker and less forgiving than plain copier paper. A straight/simple feed path is valuable. |
| **Color inkjet, not a color laser** | Better fit for full-color art and inkjet-rated printable vinyl. Home color lasers are usually narrower and their heat can be unsuitable for generic vinyl sheets. |
| **Refillable, separately colored bottles** | Cyan can be refilled independently when the blue-heavy label collection uses it first. This avoids the waste and expense of tri-color cartridges. |
| **Flatbed scanner** | Useful for selectively replacing a few visibly poor web-cover images with personal reference scans, and for ordinary household scanning. |
| **No mandatory subscription or cartridge authentication scheme** | A normal local USB/Wi-Fi printer with manufacturer ink bottles is the preferred ownership model. Avoid HP cartridge/HP+ products for this project. |
| **Reasonable idle maintenance** | Any inkjet needs occasional use. A nozzle check or small color print every few weeks is a sensible ownership habit. |
| **At least a two-year registered warranty** | A fixed print head is the expensive failure point; buy new, register it promptly, and retain the receipt. |

The minimum viable physical size is 11 x 17 in. The recommendation is 13 x 19
in because it avoids buying a machine that is already at its limit on the first
project. It does not mean every future job needs 13 x 19 paper.

### Shortlist: real candidates, not just one answer

Prices below are observations on 2026-08-06 and should be rechecked at the
retailer immediately before buying.

| Printer | Current observed price | What it gets right | Main trade-off | Verdict |
| --- | ---: | --- | --- | --- |
| **Epson EcoTank ET-15000** | **$599.99 sale; $699.99 regular** | 13 x 19 printing, CMYK refillable tanks with visible levels, flatbed/ADF scanner, rear feed, ordinary all-in-one features, and a two-year registered warranty. | Four inks rather than photo-oriented six; not a professional photo printer. | **Best fit.** |
| Epson EcoTank Photo ET-8550 | $749.99 regular (recently $599.99 sale) | 13 x 19 printing; six tanks including gray and photo/matte black; substantially better photo and fine-art output. | Higher up-front cost and its extra photo capability is unlikely to earn its keep here. | Choose only if art/photo printing becomes a real hobby. |
| Epson EcoTank Pro ET-16600 | $1,049.99 | More business-oriented mechanism: 500-sheet dual trays, 11 x 17 scanning, 13 x 19 print, rear feed, and two-year warranty. | Huge, much more expensive, and overbuilt for a lightly used home printer; color speed is not meaningfully better than the ET-15000. | Excellent office machine; poor value for this home use. |
| Brother MFC-J6955DW INKvestment Tank | $469.99 | 11 x 17 print/scan, very strong paper handling, double-sided single-pass scanning, 2-year warranty, and a stated durability-oriented business design. | Despite its name, it uses replaceable cartridges rather than pour-in tanks; 11 x 17 is its ceiling, and its print focus is business documents rather than art/vinyl. | Worth considering only if heavy document scanning/printing outweighs label quality and tank economics. |

Canon's current U.S. MegaTank office lineup and HP's Smart Tank lineup are
legitimate bottle-ink products, but the readily available all-in-ones are
generally limited to Letter/Legal sizes. They fail the wide-format requirement.
That is why this is not a case of overlooking a cheaper obvious Canon or HP
equivalent.

### Why the ET-15000 is the recommendation rather than a brand reflex

It clears every actual requirement without paying for capabilities that are
unlikely to be used:

- Its tanks are **four separate reservoirs**—black, cyan, magenta, and yellow.
  The transparent front windows are real level indicators, so one depleted
  color can be refilled without discarding the others.
- It can make the current label set two-up on 11 x 17 vinyl, while its 13 x 19
  capacity leaves room for less constrained future layouts.
- It includes a flatbed scanner and document feeder. The scanner gives the
  project a selective, legitimate way to improve a small number of bad source
  covers.
- Its user guide documents nozzle checks, print-head cleaning, and replacement
  of the consumable maintenance box. That is not a guarantee of indefinite
  life, but it is a more practical ownership path than a cheap cartridge
  printer.

The $599.99 price is not an automatic command to buy: sales recur. It *is* a
fair price for this model and a materially better value than its $699.99 normal
price. If the decision is broadly made and the retailer provides normal return
rights, buying during the sale is rational; do not rush past a quick check of
physical footprint, return policy, and warranty registration terms.

### Reliability: treat reviews as evidence, not noise

The ET-15000 is an older, capable wide-format all-in-one, but it is not a
proven zero-risk purchase. Negative owner reviews commonly center on the
standard inkjet failure modes: nozzle clogs after irregular use, paper-feed
problems, connectivity/software irritation, and a bad experience when a
particular unit fails. Independent testing also finds it better at everyday
documents than at photo color accuracy, fine photo detail, or fine-detail
scanning.

Store reviews naturally overrepresent people whose purchase went wrong, but a
cluster of the same complaint is still a **yellow flag**. The conclusion is
not "ignore the reviews"; it is: do not buy this exact model from a seller with
a poor return process, and do not count a short sale deadline as proof that it
is right. Prefer a retailer with an uncomplicated return window, register the
two-year warranty immediately, test ordinary paper, a scan, and a few sheets
of the intended vinyl at once, and return it during that window if it shows
banding, feed trouble, or unreliable connectivity.

### Amazon listing: useful review signal, check the actual seller

The investigated Amazon product page for the ET-15000 had **4.2 / 5 stars from
2,532 ratings** on 2026-08-06. That is a meaningful counterweight to a
negative-looking slice of reviews on Epson's own store: it supports the view
that many owners are satisfied, without proving that a specific unit will be
trouble-free. Still read the most recent one- to three-star reviews and look
for one repeated defect rather than reacting only to the average.

The same Amazon page showed a price around **$545**, but the active offer was
sold and shipped by the third-party seller **SLI Cloud**, not Amazon.com. The
listing showed Amazon's 30-day refund/replacement framework, yet a third-party
sale is not automatically the same support experience as a direct retailer.
Seller and price can change by location and minute.

For this particular purchase, use this rule:

- A new ET-15000 at about $545, sold by Amazon.com or a known authorized
  retailer with an ordinary return process, is a strong buy.
- If the $545 offer is only from an unfamiliar marketplace seller, paying about
  $55 more for Epson or another clearly established retailer is reasonable.
  The lower-risk initial return and warranty-paperwork path is worth more than
  a small fraction of the printer price.

Keep the invoice. Epson's coverage is one year/50,000 sheets and extends to two
years/50,000 sheets with product registration; warranty service requires proof
of original purchase.

### What this printer is not

The ET-15000 is not a laser printer and should not be expected to behave like a
zero-maintenance appliance. It should live in a normal indoor room, away from
freezing temperatures, direct sun, and persistent dampness. Seasonal
warm/cool variation in an occupied home office is ordinarily not a reason to
relocate it. Use it occasionally and run a nozzle check after a long idle
period.

It is also not an archival photo-production system. For a future permanent V3,
durability comes primarily from choosing a good printable vinyl and adding
matte cold laminate—not from moving to a six-color photo printer.

### Selective cover scanning

An all-in-one printer's flatbed scanner is useful for this project even if the
printer is purchased mainly for labels. It creates a practical option for
replacing an occasional poor web image with a scan from a comic already in the
collection. Treat that as targeted restoration, not a new requirement to scan
every cover: a few conspicuously low-resolution or poorly cropped images are
the highest-value candidates. Keep the existing visual treatment and crop so a
scan remains visually consistent with the surrounding labels.

An Epson EcoTank Photo ET-8550 was discussed as a reference point, not a final
choice: it supports 13 x 19 in media and uses six refillable ink tanks, but its
initial cost means professional printing remains cheaper for this one project.

## Reference links to re-check when buying

- [Platypus Printing: Printed Adhesive Vinyl by the Square Foot](https://platypusprinting.com/products/vinyl-by-the-sqft)
- [ORAJET 1917 inkjet printable adhesive vinyl: example material specification](https://atlantavinylstore.com/products/orajet-1917-oracal-inkjet-printable-vinyl-sheet-packs)
- [Epson EcoTank Photo ET-8550: reference printer specification](https://epson.com/For-Work/Printers/Inkjet/EcoTank-Photo-ET-8550-All-in-One-Wide-format-Supertank-Printer/p/C11CJ21201)

Vendor pricing, stock, material formulation, and shipping may change. Obtain a
physical proof before committing to a full label run.
