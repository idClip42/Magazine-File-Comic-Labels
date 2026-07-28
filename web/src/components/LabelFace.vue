<script setup lang="ts">
import { computed, ref, type CSSProperties } from "vue";
import { deriveMutedCategoryColor } from "../../../src/color";
import {
    clamp,
    CROP_SCALE_MAX,
    CROP_SCALE_MIN,
    roundCropValue,
} from "../../../src/crop";
import type { LabelConfig } from "../../../src/types";
import { staticAssetUrl } from "../config";
import { useCatalogStore } from "../stores/catalog";
import LabelContents from "./LabelContents.vue";

const props = defineProps<{ label: LabelConfig }>();
const catalog = useCatalogStore();

type ImageMetrics = {
    aspectRatio: number;
};

type PanState = {
    pointerId: number;
    startClientX: number;
    startClientY: number;
    crop: { focus: { x: number; y: number }; scale: number };
};

const imageMetrics = ref<ImageMetrics>();
const panState = ref<PanState>();

const category = computed(() => {
    const value = catalog.config?.categories[props.label.category];
    if (!value) throw new Error(`Unknown category: ${props.label.category}`);
    return value;
});

const logo = computed(() => {
    const value = category.value.logos[props.label.logo];
    if (!value) throw new Error(`Unknown logo: ${props.label.category}/${props.label.logo}`);
    return value;
});

const preparedLogo = computed(() =>
    catalog.config?.preparedLogos[`${props.label.category}/${props.label.logo}`],
);

const artTreatment = computed(() => ({
    ...catalog.layout!.artTreatment,
    ...category.value.artTreatment,
}));

const artworkUrl = computed(() =>
    catalog.config?.artworkUrls[props.label.id] ?? "",
);

const frameAspectRatio = computed(() => {
    const layout = catalog.layout!;
    const width = layout.face.widthInches + layout.overwrapInches * 2;
    const height = layout.face.heightInches + layout.overwrapInches * 2;
    return width / height;
});

/**
 * Size at 1x. `cover` means one dimension fills the label while the other is
 * allowed to extend beyond it. Values are ratios of the label dimensions.
 */
const coverSize = computed(() => {
    if (!imageMetrics.value) return undefined;
    const imageAspect = imageMetrics.value.aspectRatio;
    const frameAspect = frameAspectRatio.value;
    return imageAspect >= frameAspect
        ? { width: imageAspect / frameAspect, height: 1 }
        : { width: 1, height: frameAspect / imageAspect };
});

const artStyle = computed(() => ({
    "--category-color": category.value.color,
    "--art-position": `${props.label.art.crop.focus.x * 100}% ${props.label.art.crop.focus.y * 100}%`,
    "--art-zoom": String(props.label.art.crop.scale),
    "--logo-max-width": `${logo.value.maxWidthPercent ?? 94}%`,
    "--art-saturation": String(artTreatment.value.saturation),
    "--art-contrast": String(artTreatment.value.contrast),
    "--art-brightness": String(artTreatment.value.brightness),
    "--tint-opacity": String(artTreatment.value.tintOpacity),
    "--tint-blend": artTreatment.value.tintBlendMode,
}));

/**
 * This is the same crop geometry as CSS `background-size: cover` plus its
 * scale transform, expressed as one image plane. The explicit plane lets the
 * drag handler use the real, clamped pan bounds.
 */
const artImageStyle = computed<CSSProperties>(() => {
    const baseSize = coverSize.value;
    if (!baseSize) return {};

    const { focus, scale } = props.label.art.crop;
    const width = baseSize.width * scale;
    const height = baseSize.height * scale;
    return {
        inset: "auto",
        left: `${focus.x * (1 - width) * 100}%`,
        top: `${focus.y * (1 - height) * 100}%`,
        width: `${width * 100}%`,
        height: `${height * 100}%`,
        objectFit: "fill" as const,
        transform: "none",
    };
});

const logoStyle = computed(() => ({
    "--logo-primary": category.value.color,
    "--logo-secondary": deriveMutedCategoryColor(
        category.value.color,
        catalog.layout!.logoPalette.mutedSaturationMultiplier,
    ),
}));

const rasterLogoUrl = computed(() =>
    staticAssetUrl(catalog.layout!, logo.value.asset),
);

const years = computed(() => {
    const ranges = props.label.contents
        .map(content => content.years)
        .filter((range): range is [number, number] => range !== undefined);
    if (ranges.length === 0) return "";

    const format = ([start, end]: [number, number]) =>
        start === end ? String(start) : `${start}–${end}`;
    if (catalog.layout!.years.display === "condensed-range") {
        return format([ranges[0][0], ranges[ranges.length - 1][1]]);
    }
    return [...new Set(ranges.map(format))].join(" · ");
});

function onArtworkLoad(event: Event): void {
    const image = event.currentTarget as HTMLImageElement;
    if (image.naturalWidth === 0 || image.naturalHeight === 0) return;
    imageMetrics.value = {
        aspectRatio: image.naturalWidth / image.naturalHeight,
    };
}

function roundedCrop(
    focusX: number,
    focusY: number,
    scale: number,
): { focus: { x: number; y: number }; scale: number } {
    return {
        focus: {
            x: roundCropValue(clamp(focusX, 0, 1), 4),
            y: roundCropValue(clamp(focusY, 0, 1), 4),
        },
        scale: roundCropValue(clamp(scale, CROP_SCALE_MIN, CROP_SCALE_MAX), 3),
    };
}

function focusAfterPan(
    startFocus: number,
    movement: number,
    frameSize: number,
    baseSize: number,
    scale: number,
): number {
    const renderedSize = baseSize * scale;
    const panExtent = frameSize - renderedSize;
    // At 1x the fitted dimension has no overflow, so it has no pan movement.
    if (Math.abs(panExtent) < 0.001) return startFocus;
    return clamp(startFocus + movement / panExtent, 0, 1);
}

function startPan(event: PointerEvent): void {
    if (catalog.view !== "editor" || event.button !== 0 || !event.isPrimary || !coverSize.value) return;
    const label = event.currentTarget as HTMLElement;
    event.preventDefault();
    label.setPointerCapture(event.pointerId);
    panState.value = {
        pointerId: event.pointerId,
        startClientX: event.clientX,
        startClientY: event.clientY,
        crop: {
            focus: { ...props.label.art.crop.focus },
            scale: props.label.art.crop.scale,
        },
    };
}

function panArtwork(event: PointerEvent): void {
    if (catalog.view !== "editor") return;
    const pan = panState.value;
    const baseSize = coverSize.value;
    if (!pan || pan.pointerId !== event.pointerId || !baseSize) return;

    const label = event.currentTarget as HTMLElement;
    const bounds = label.getBoundingClientRect();
    const focusX = focusAfterPan(
        pan.crop.focus.x,
        event.clientX - pan.startClientX,
        bounds.width,
        bounds.width * baseSize.width,
        pan.crop.scale,
    );
    const focusY = focusAfterPan(
        pan.crop.focus.y,
        event.clientY - pan.startClientY,
        bounds.height,
        bounds.height * baseSize.height,
        pan.crop.scale,
    );
    catalog.updateCrop(props.label.id, roundedCrop(focusX, focusY, pan.crop.scale));
}

function endPan(event: PointerEvent): void {
    if (panState.value?.pointerId !== event.pointerId) return;
    const label = event.currentTarget as HTMLElement;
    if (label.hasPointerCapture(event.pointerId)) label.releasePointerCapture(event.pointerId);
    panState.value = undefined;
}

function focusAnchoredAtPointer(
    focus: number,
    pointer: number,
    frameSize: number,
    baseSize: number,
    previousScale: number,
    nextScale: number,
): number {
    const previousRenderedSize = baseSize * previousScale;
    const previousOffset = focus * (frameSize - previousRenderedSize);
    const sourcePosition = (pointer - previousOffset) / previousRenderedSize;
    const nextRenderedSize = baseSize * nextScale;
    const nextPanExtent = frameSize - nextRenderedSize;
    if (Math.abs(nextPanExtent) < 0.001) return focus;
    return clamp(
        (pointer - sourcePosition * nextRenderedSize) / nextPanExtent,
        0,
        1,
    );
}

function wheelZoom(event: WheelEvent): void {
    if (catalog.view !== "editor") return;
    const baseSize = coverSize.value;
    if (!baseSize) return;

    event.preventDefault();
    const label = event.currentTarget as HTMLElement;
    const bounds = label.getBoundingClientRect();
    const unit = event.deltaMode === WheelEvent.DOM_DELTA_LINE
        ? 16
        : event.deltaMode === WheelEvent.DOM_DELTA_PAGE
            ? bounds.height
            : 1;
    const multiplier = Math.exp(-event.deltaY * unit * 0.0015);
    const previousCrop = props.label.art.crop;
    const scale = clamp(
        previousCrop.scale * multiplier,
        CROP_SCALE_MIN,
        CROP_SCALE_MAX,
    );
    if (scale === previousCrop.scale) return;

    const pointerX = clamp(event.clientX - bounds.left, 0, bounds.width);
    const pointerY = clamp(event.clientY - bounds.top, 0, bounds.height);
    const focusX = focusAnchoredAtPointer(
        previousCrop.focus.x,
        pointerX,
        bounds.width,
        bounds.width * baseSize.width,
        previousCrop.scale,
        scale,
    );
    const focusY = focusAnchoredAtPointer(
        previousCrop.focus.y,
        pointerY,
        bounds.height,
        bounds.height * baseSize.height,
        previousCrop.scale,
        scale,
    );
    catalog.updateCrop(props.label.id, roundedCrop(focusX, focusY, scale));
}
</script>

<template>
  <article
    class="label"
    :class="{
      'crop-is-interactive': catalog.view === 'editor',
      'crop-is-panning': panState,
    }"
    :style="artStyle"
    :data-label-id="label.id"
    @pointerdown="startPan"
    @pointermove="panArtwork"
    @pointerup="endPan"
    @pointercancel="endPan"
    @wheel="wheelZoom"
  >
    <div class="artwork" aria-hidden="true">
      <img
        class="artwork-image"
        :src="artworkUrl"
        :style="artImageStyle"
        draggable="false"
        @load="onArtworkLoad"
      />
    </div>
    <div class="artwork-tint" aria-hidden="true" />
    <div class="top-rule" aria-hidden="true" />

    <section class="identity-band" :style="logoStyle">
      <div
        v-if="preparedLogo"
        class="logo inline-logo"
        role="img"
        :aria-label="`${category.name} logo`"
        v-html="preparedLogo"
      />
      <img
        v-else
        class="logo raster-logo"
        :src="rasterLogoUrl"
        :alt="`${category.name} logo`"
      />
      <div
        v-if="years || catalog.layout?.years.reserveSpaceWhenEmpty"
        class="years"
      >{{ years }}</div>
    </section>

    <div class="finger-hole-guide" aria-hidden="true" />
    <section class="metadata-band"><LabelContents :label="label" /></section>
  </article>
</template>
