<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { staticAssetUrl } from "../../../../src/core/assets";
import { deriveMutedCategoryColor } from "../../../../src/core/color";
import type { LabelConfig } from "../../../../src/core/types";
import { useCatalogStore } from "../../stores/catalog";
import LabelContents from "./LabelContents.vue";
import { useCropInteraction } from "./useCropInteraction";

const props = defineProps<{ label: LabelConfig }>();
const catalog = useCatalogStore();

const category = computed(() => {
    const value = catalog.config?.categories[props.label.category];
    if (!value) throw new Error(`Unknown category: ${props.label.category}`);
    return value;
});

const logo = computed(() => {
    const value = category.value.logos[props.label.logo];
    if (!value)
        throw new Error(
            `Unknown logo: ${props.label.category}/${props.label.logo}`,
        );
    return value;
});

const preparedLogo = computed(
    () =>
        catalog.config?.preparedLogos[
            `${props.label.category}/${props.label.logo}`
        ],
);
const artTreatment = computed(() => ({
    ...catalog.layout!.artTreatment,
    ...category.value.artTreatment,
}));
const artworkUrl = computed(() => catalog.artworkUrl(props.label.art.asset));

const frameAspectRatio = computed(() => {
    const layout = catalog.layout!;
    return (
        (layout.face.widthInches + layout.overwrapInches * 2) /
        layout.face.heightInches
    );
});

const imageAspectRatio = ref<number>();
const artworkImage = ref<HTMLImageElement>();
const coverSize = computed(() => {
    if (!imageAspectRatio.value) return undefined;
    const imageAspect = imageAspectRatio.value;
    const frameAspect = frameAspectRatio.value;
    return imageAspect >= frameAspect
        ? { width: imageAspect / frameAspect, height: 1 }
        : { width: 1, height: frameAspect / imageAspect };
});

const {
    artImageStyle,
    cropGuidesActive,
    panState,
    measureArtwork,
    onArtworkLoad,
    startPan,
    panArtwork,
    endPan,
    wheelZoom,
} = useCropInteraction({
    label: () => props.label,
    coverSize,
    imageAspectRatio,
    isEditor: () => catalog.view === "editor",
    updateCrop: nextCrop => catalog.updateCrop(props.label.id, nextCrop),
});

// Browsers may finish decoding an already-cached image before the load handler
// runs. Measure it after mount as well, so that case cannot disable crop input.
onMounted(() => {
    if (artworkImage.value?.complete) measureArtwork(artworkImage.value);
});

const artStyle = computed(() => ({
    "--logo-max-width": `${(catalog.layout!.face.widthInches * (logo.value.maxWidthPercent ?? 94)) / 100}in`,
    "--category-color": category.value.color,
    "--art-position": `${props.label.art.crop.focus.x * 100}% ${props.label.art.crop.focus.y * 100}%`,
    "--art-zoom": String(props.label.art.crop.scale),
    "--art-saturation": String(artTreatment.value.saturation),
    "--art-contrast": String(artTreatment.value.contrast),
    "--art-brightness": String(artTreatment.value.brightness),
    "--tint-opacity": String(artTreatment.value.tintOpacity),
    "--tint-blend": artTreatment.value.tintBlendMode,
}));

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
</script>

<template>
    <article
        class="label"
        :class="{
            'crop-is-interactive': catalog.view === 'editor',
            'crop-is-panning': panState,
            'crop-guides-active': cropGuidesActive,
        }"
        :style="artStyle"
        :data-label-id="label.id"
        @pointerdown="startPan"
        @pointermove="panArtwork"
        @pointerup="endPan"
        @pointercancel="endPan"
        @wheel="wheelZoom"
    >
        <div
            class="artwork"
            aria-hidden="true"
        >
            <img
                ref="artworkImage"
                class="artwork-image"
                :src="artworkUrl"
                :style="artImageStyle"
                draggable="false"
                @load="onArtworkLoad"
            />
        </div>
        <div
            class="artwork-tint"
            aria-hidden="true"
        />
        <div
            class="top-rule"
            aria-hidden="true"
        />
        <div
            class="crop-boundary-guide"
            aria-hidden="true"
        />

        <section
            class="identity-band"
            :style="logoStyle"
        >
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
            >
                {{ years }}
            </div>
        </section>

        <div
            class="finger-hole-guide"
            aria-hidden="true"
        />
        <section class="metadata-band">
            <LabelContents :label="label" />
        </section>
    </article>
</template>
