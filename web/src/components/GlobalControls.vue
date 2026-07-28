<script setup lang="ts">
import { computed, ref } from "vue";
import { identityBandCssVariables } from "../layout-css";
import { useCatalogStore } from "../stores/catalog";

const catalog = useCatalogStore();
const previewIdentityHeight = ref<number | undefined>();
const identityHeight = computed(() =>
    previewIdentityHeight.value ?? catalog.layout?.identityBand.heightInches ?? 0,
);
let previewFrame: number | undefined;

function applyPreview(): void {
    previewFrame = undefined;
    const layout = catalog.layout;
    const height = previewIdentityHeight.value;
    if (!layout || height === undefined) return;

    for (const [name, value] of Object.entries(identityBandCssVariables(layout, height))) {
        document.documentElement.style.setProperty(name, value);
    }
}

function updateIdentityHeight(event: Event): void {
    const height = Number((event.target as HTMLInputElement).value);
    if (!Number.isFinite(height)) return;

    catalog.beginIdentityBandAdjustment();
    previewIdentityHeight.value = height;
    if (previewFrame === undefined) previewFrame = window.requestAnimationFrame(applyPreview);
}

function finishIdentityHeightAdjustment(): void {
    if (previewFrame !== undefined) {
        window.cancelAnimationFrame(previewFrame);
        applyPreview();
    }

    const height = previewIdentityHeight.value;
    if (height !== undefined) {
        catalog.updateIdentityBandHeight(height);
        previewIdentityHeight.value = undefined;
    }
    catalog.endIdentityBandAdjustment();
}
</script>

<template>
  <aside class="global-controls" aria-label="Global label controls" aria-live="polite">
    <label class="identity-band-height-control">
      Identity height
      <input
        type="range"
        min="0.5"
        max="3.5"
        step="0.01"
        :value="identityHeight"
        @input="updateIdentityHeight"
        @pointerdown="catalog.beginIdentityBandAdjustment"
        @pointerup="finishIdentityHeightAdjustment"
        @pointercancel="finishIdentityHeightAdjustment"
        @lostpointercapture="finishIdentityHeightAdjustment"
        @change="finishIdentityHeightAdjustment"
        @blur="finishIdentityHeightAdjustment"
      />
      <output>{{ identityHeight.toFixed(2) }}″</output>
    </label>
    <button
      type="button"
      :disabled="!catalog.isSaveAvailable || !catalog.hasPendingChanges"
      @click="catalog.saveChanges"
    >Save changes</button>
    <span>{{ catalog.saveStatus() }}</span>
  </aside>
</template>
