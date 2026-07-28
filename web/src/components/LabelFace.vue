<script setup lang="ts">
import { computed } from "vue";
import { deriveMutedCategoryColor } from "../../../src/color";
import type { LabelConfig } from "../../../src/types";
import { staticAssetUrl } from "../config";
import { useCatalogStore } from "../stores/catalog";
import LabelContents from "./LabelContents.vue";

const props = defineProps<{ label: LabelConfig }>();
const catalog = useCatalogStore();

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

const artStyle = computed(() => ({
    "--category-color": category.value.color,
    "--art-image": `url("${catalog.config?.artworkUrls[props.label.id] ?? ""}")`,
    "--art-position": `${props.label.art.crop.focus.x * 100}% ${props.label.art.crop.focus.y * 100}%`,
    "--art-zoom": String(props.label.art.crop.scale),
    "--logo-max-width": `${logo.value.maxWidthPercent ?? 94}%`,
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
  <article class="label" :style="artStyle" :data-label-id="label.id">
    <div class="artwork" aria-hidden="true"><div class="artwork-image" /></div>
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
