import { deriveMutedCategoryColor } from "./color";
import { categories, layout } from "./config";
import { PreparedLogos } from "./logo-prep";
import { Category, CategoryLogo, LabelConfig } from "./types";

function escapeHtml(value: string | number): string {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function formatRange(range?: [number, number], prefix = ""): string {
    if (!range) return "";
    const [start, end] = range;
    return start === end ? `${prefix}${start}` : `${prefix}${start}–${end}`;
}

function assetUrl(asset: string): string {
    if (/^https?:\/\//i.test(asset)) return asset;
    return `../../${layout.localAssetRoot}/${asset}`;
}

function renderLogo(
    categoryId: string,
    logoId: string,
    category: Category,
    logo: CategoryLogo,
    preparedLogos: PreparedLogos,
): string {
    const svg = preparedLogos.get(`${categoryId}/${logoId}`);
    if (!svg) {
        return `<img class="logo raster-logo" src="${escapeHtml(assetUrl(logo.asset))}" alt="${escapeHtml(category.name)} logo">`;
    }

    const primary = category.color;
    const secondary = deriveMutedCategoryColor(
        category.color,
        layout.logoPalette.mutedSaturationMultiplier,
    );
    return `<div class="logo inline-logo" role="img" aria-label="${escapeHtml(category.name)} logo" style="--logo-primary:${escapeHtml(primary)}; --logo-secondary:${escapeHtml(secondary)};">${svg}</div>`;
}

function renderContents(label: LabelConfig): string {
    return label.contents
        .map(content => {
            const name = content.name
                ? `<span class="content-name">${escapeHtml(content.name)}</span>`
                : "";
            const volume = content.volume
                ? `<span class="content-volume">Vol. ${content.volume}</span>`
                : "";
            const issues = content.issues
                ? `<span class="content-issues">${escapeHtml(formatRange(content.issues, "#"))}</span>`
                : "";
            return `<div class="content-row">${name}${volume}${issues}</div>`;
        })
        .join("");
}

function labelYears(label: LabelConfig): string {
    const yearRanges = label.contents
        .map(content => content.years)
        .filter((years): years is [number, number] => years !== undefined);

    if (yearRanges.length === 0) return "";

    if (layout.years.display === "condensed-range") {
        const firstYear = yearRanges[0][0];
        const lastYear = yearRanges[yearRanges.length - 1][1];
        return formatRange([firstYear, lastYear]);
    }

    return [...new Set(yearRanges.map(years => formatRange(years)))].join(
        " · ",
    );
}

export function renderLabel(
    label: LabelConfig,
    preparedLogos: PreparedLogos,
    artworkUrl = assetUrl(label.art.asset),
): string {
    const category = categories[label.category];
    if (!category)
        throw new Error(
            `Label ${label.id} references unknown category ${label.category}.`,
        );

    const logo = category.logos[label.logo];
    if (!logo)
        throw new Error(
            `Label ${label.id} references unknown logo ${label.category}/${label.logo}.`,
        );

    const crop = label.art.crop;
    const cropPosition = `${crop.focus.x * 100}% ${crop.focus.y * 100}%`;
    const logoWidth = logo.maxWidthPercent ?? 94;
    const treatment = { ...layout.artTreatment, ...category.artTreatment };

    return `
    <div class="label-editor">
    <article class="label" style="--category-color:${escapeHtml(category.color)}; --art-image:url('${escapeHtml(artworkUrl)}'); --art-position:${cropPosition}; --art-zoom:${crop.scale}; --logo-max-width:${logoWidth}%; --art-saturation:${treatment.saturation}; --art-contrast:${treatment.contrast}; --art-brightness:${treatment.brightness}; --tint-opacity:${treatment.tintOpacity}; --tint-blend:${treatment.tintBlendMode};" data-label-id="${escapeHtml(label.id)}">
      <div class="artwork" aria-hidden="true"><div class="artwork-image"></div></div>
      <div class="artwork-tint" aria-hidden="true"></div>
      <div class="top-rule" aria-hidden="true"></div>
      <section class="identity-band">
        ${renderLogo(label.category, label.logo, category, logo, preparedLogos)}
        <div class="years">${escapeHtml(labelYears(label))}</div>
      </section>
      <div class="finger-hole-guide" aria-hidden="true"></div>
      <section class="metadata-band">
        ${renderContents(label)}
      </section>
    </article>
    <section class="crop-controls" aria-label="Crop controls for ${escapeHtml(label.id)}">
      <div class="crop-controls-title">${escapeHtml(label.id)} crop</div>
      <label>Focus X <input type="range" min="0" max="1" step="0.01" value="${crop.focus.x}" data-crop-field="x"><input type="number" min="0" max="1" step="0.01" value="${crop.focus.x}" data-crop-number="x"></label>
      <label>Focus Y <input type="range" min="0" max="1" step="0.01" value="${crop.focus.y}" data-crop-field="y"><input type="number" min="0" max="1" step="0.01" value="${crop.focus.y}" data-crop-number="y"></label>
      <label>Zoom <input type="range" min="0.5" max="5" step="0.01" value="${crop.scale}" data-crop-field="zoom"><input type="number" min="0.5" max="5" step="0.01" value="${crop.scale}" data-crop-number="zoom"></label>
      <div class="crop-config"><input type="text" readonly aria-label="Updated crop configuration" data-crop-config><button type="button" data-copy-crop>Copy</button></div>
    </section>
    </div>`;
}

export function renderDocument(
    labels: LabelConfig[],
    preparedLogos: PreparedLogos,
    artworkUrlForLabel?: (label: LabelConfig) => string,
): string {
    const totalWidth = layout.face.widthInches + layout.overwrapInches * 2;
    const totalHeight = layout.face.heightInches + layout.overwrapInches * 2;
    const identityTop = layout.overwrapInches + layout.identityBand.topInches;
    const metadataTop = layout.overwrapInches + layout.metadataBand.topInches;
    const holeHeight = layout.fingerHole.diameterInches / 2;
    const guideWidth =
        layout.fingerHole.diameterInches * layout.fingerHole.guideScale;
    const guideHeight = holeHeight * layout.fingerHole.guideScale;
    const holeTop =
        layout.overwrapInches +
        layout.fingerHole.topInches +
        (holeHeight - guideHeight) / 2;

    const cssVariables = `
    --face-width:${layout.face.widthInches}in;
    --face-height:${layout.face.heightInches}in;
    --overwrap:${layout.overwrapInches}in;
    --total-width:${totalWidth}in;
    --total-height:${totalHeight}in;
    --top-rule-height:${layout.topRuleHeightInches}in;
    --art-saturation:${layout.artTreatment.saturation};
    --art-contrast:${layout.artTreatment.contrast};
    --art-brightness:${layout.artTreatment.brightness};
    --tint-opacity:${layout.artTreatment.tintOpacity};
    --tint-blend:${layout.artTreatment.tintBlendMode};
    --identity-top:${identityTop}in;
    --identity-height:${layout.identityBand.heightInches}in;
    --metadata-top:${metadataTop}in;
    --metadata-height:${layout.metadataBand.heightInches}in;
    --hole-width:${guideWidth}in;
    --hole-height:${guideHeight}in;
    --hole-top:${holeTop}in;
    --years-size:${layout.typography.yearsSizeInches}in;
    --metadata-size:${layout.typography.metadataSizeInches}in;
    --band-gap:${layout.typography.bandGapInches}in;
    --logo-outline-color:${layout.logoOutline.color};
    --logo-outline-width:${layout.logoOutline.enabled ? `${layout.logoOutline.widthPixels}px` : "0"};
    --logo-outline-linejoin:${layout.logoOutline.lineJoin};
    --cut-guide-display:${layout.showCutGuide ? "block" : "none"};`;

    return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="referrer" content="no-referrer">
  <title>Comic magazine file labels — V2</title>
  <style>
    :root { ${cssVariables} }
    @page { size: var(--total-width) var(--total-height); margin: 0; }
    * { box-sizing: border-box; }
    body { margin: 0; background: #777; font-family: Arial, Helvetica, sans-serif; }
    .label {
      width: var(--total-width); height: var(--total-height); position: relative; overflow: hidden;
      isolation: isolate; background: var(--category-color); break-after: page; page-break-after: always;
    }
    .artwork, .artwork-tint { position: absolute; inset: 0; }
    .artwork { overflow: hidden; }
    .artwork-image { position: absolute; inset: 0; background-image: var(--art-image); background-position: var(--art-position); background-size: cover; filter: saturate(var(--art-saturation)) contrast(var(--art-contrast)) brightness(var(--art-brightness)); transform: scale(var(--art-zoom)); transform-origin: var(--art-position); }
    .artwork-tint { background: var(--category-color); opacity: var(--tint-opacity); mix-blend-mode: var(--tint-blend); }
    .top-rule { position: absolute; top: 0; left: 0; right: 0; height: var(--top-rule-height); background: var(--category-color); z-index: 2; }
    .identity-band, .metadata-band { position: absolute; left: 0; right: 0; background: white; border-top: var(--top-rule-height) solid var(--category-color); border-bottom: var(--top-rule-height) solid var(--category-color); z-index: 2; text-align: center; }
    .identity-band { top: var(--identity-top); height: var(--identity-height); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: var(--band-gap); }
    .logo { display: block; max-width: var(--logo-max-width); }
    .raster-logo { max-height: calc(var(--identity-height) - 0.62in); object-fit: contain; }
    .inline-logo { width: var(--logo-max-width); height: calc(var(--identity-height) - 0.62in); padding: var(--logo-outline-width); color: var(--logo-primary); }
    .inline-logo svg { display: block; width: 100%; height: 100%; overflow: visible; }
    .inline-logo [data-logo-fill="primary"] { fill: var(--logo-primary) !important; }
    .inline-logo [data-logo-fill="secondary"] { fill: var(--logo-secondary) !important; }
    .inline-logo [data-logo-fill] { stroke: var(--logo-outline-color) !important; stroke-width: var(--logo-outline-width) !important; stroke-linejoin: var(--logo-outline-linejoin); vector-effect: non-scaling-stroke; paint-order: stroke fill; }
    .years { color: #111; font-weight: 800; font-size: var(--years-size); letter-spacing: 0.02em; line-height: 1; }
    .metadata-band { top: var(--metadata-top); height: var(--metadata-height); display: flex; flex-direction: column; justify-content: center; gap: var(--band-gap); padding: 0.08in 0.11in; }
    .content-row { color: #171717; font-size: var(--metadata-size); line-height: 1.05; }
    .content-name { font-weight: 800; }
    .content-volume, .content-issues { margin-left: 0.08in; white-space: nowrap; }
    .content-volume { font-style: italic; }
    .finger-hole-guide { display: var(--cut-guide-display); position: absolute; width: var(--hole-width); height: var(--hole-height); left: 50%; top: var(--hole-top); transform: translateX(-50%); border: 0.015in dashed rgba(255,255,255,0.75); border-top: 0; border-radius: 0 0 50% 50% / 0 0 100% 100%; z-index: 3; pointer-events: none; }
    .crop-controls { width: var(--total-width); padding: 0.12in; background: #f5f5f5; color: #111; font-size: 13px; box-shadow: 0 2px 8px rgba(0,0,0,0.22); }
    .crop-controls-title { margin-bottom: 0.07in; font-weight: 700; }
    .crop-controls label { display: grid; grid-template-columns: 0.6in 1fr 0.65in; align-items: center; gap: 0.08in; margin-top: 0.05in; }
    .crop-controls input[type="number"] { width: 100%; }
    .crop-config { display: flex; gap: 0.08in; margin-top: 0.09in; }
    .crop-config input { flex: 1; min-width: 0; font-family: Consolas, monospace; font-size: 11px; }
    .crop-config button { cursor: pointer; }
    .save-crops-bar { position: fixed; right: 16px; bottom: 16px; z-index: 10; display: flex; align-items: center; gap: 10px; max-width: min(520px, calc(100vw - 32px)); padding: 10px 12px; background: rgba(255,255,255,0.96); border-radius: 6px; box-shadow: 0 2px 12px rgba(0,0,0,0.3); font-size: 13px; }
    .save-crops-bar button { cursor: pointer; white-space: nowrap; }
    .save-crops-bar button:disabled { cursor: default; }
    @media screen { body { padding: 0.4in; display: flex; flex-wrap: wrap; gap: 0.3in; align-items: flex-start; } .label { box-shadow: 0 0.08in 0.25in rgba(0,0,0,0.38); } }
    @media print { body { background: transparent; padding: 0; } .label { break-after: auto; page-break-after: auto; } .label-editor { break-after: page; page-break-after: always; } .label-editor:last-child { break-after: auto; page-break-after: auto; } .crop-controls, .save-crops-bar { display: none; } }
  </style>
</head>
<body>
<div class="save-crops-bar" aria-live="polite">
  <button type="button" data-save-all-crops disabled>Save all crop changes</button>
  <span data-save-crops-status>Start the local editor with <code>npm start</code> to save to config/labels.json.</span>
</div>
${labels.map(label => renderLabel(label, preparedLogos, artworkUrlForLabel?.(label))).join("\n")}
<script>
  const pendingCrops = new Map();
  const saveButton = document.querySelector('[data-save-all-crops]');
  const saveStatus = document.querySelector('[data-save-crops-status]');
  const isLocalEditor = location.protocol === 'http:' || location.protocol === 'https:';
  const updateSaveControls = () => {
    saveButton.disabled = !isLocalEditor || pendingCrops.size === 0;
    if (!isLocalEditor) {
      saveStatus.textContent = 'Start the local editor with npm start to save to config/labels.json.';
    } else if (pendingCrops.size > 0) {
      saveStatus.textContent = pendingCrops.size + ' crop change' + (pendingCrops.size === 1 ? '' : 's') + ' ready to save.';
    } else {
      saveStatus.textContent = 'All crop changes are saved.';
    }
  };
  document.querySelectorAll('.label-editor').forEach(editor => {
    const label = editor.querySelector('.label');
    const labelId = label.dataset.labelId;
    const controls = editor.querySelector('.crop-controls');
    const fields = { x: controls.querySelector('[data-crop-field="x"]'), y: controls.querySelector('[data-crop-field="y"]'), zoom: controls.querySelector('[data-crop-field="zoom"]') };
    const numbers = { x: controls.querySelector('[data-crop-number="x"]'), y: controls.querySelector('[data-crop-number="y"]'), zoom: controls.querySelector('[data-crop-number="zoom"]') };
    const config = controls.querySelector('[data-crop-config]');
    const copyButton = controls.querySelector('[data-copy-crop]');
    const update = (name, value, markDirty = true) => {
      const number = Number(value);
      if (!Number.isFinite(number)) return;
      fields[name].value = String(number);
      numbers[name].value = String(number);
      if (name === 'x' || name === 'y') label.style.setProperty('--art-position', (Number(fields.x.value) * 100) + '% ' + (Number(fields.y.value) * 100) + '%');
      if (name === 'zoom') label.style.setProperty('--art-zoom', String(number));
      config.value = '"crop": { "focus": { "x": ' + fields.x.value + ', "y": ' + fields.y.value + ' }, "scale": ' + fields.zoom.value + ' }';
      if (markDirty) {
        pendingCrops.set(labelId, { focus: { x: Number(fields.x.value), y: Number(fields.y.value) }, scale: Number(fields.zoom.value) });
        updateSaveControls();
      }
    };
    Object.keys(fields).forEach(name => {
      fields[name].addEventListener('input', event => update(name, event.target.value));
      numbers[name].addEventListener('input', event => update(name, event.target.value));
      update(name, fields[name].value, false);
    });
    copyButton.addEventListener('click', async () => {
      config.select();
      try { await navigator.clipboard.writeText(config.value); } catch { document.execCommand('copy'); }
      copyButton.textContent = 'Copied';
      setTimeout(() => { copyButton.textContent = 'Copy'; }, 1200);
    });
  });
  saveButton.addEventListener('click', async () => {
    if (pendingCrops.size === 0) return;
    saveButton.disabled = true;
    saveStatus.textContent = 'Saving crop changes…';
    try {
      const response = await fetch('/api/crops', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ crops: Object.fromEntries(pendingCrops) }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Unable to save crop changes.');
      pendingCrops.clear();
      updateSaveControls();
      saveStatus.textContent = 'Saved ' + result.saved + ' crop change' + (result.saved === 1 ? '' : 's') + ' to config/labels.json.';
    } catch (error) {
      saveStatus.textContent = 'Save failed: ' + error.message;
      saveButton.disabled = !isLocalEditor || pendingCrops.size === 0;
    }
  });
  updateSaveControls();
</script>
</body>
</html>`;
}
