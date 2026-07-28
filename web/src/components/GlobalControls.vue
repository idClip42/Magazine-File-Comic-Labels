<script setup lang="ts">
import { computed } from "vue";
import { useCatalogStore } from "../stores/catalog";

const catalog = useCatalogStore();
const identityHeight = computed(() => catalog.layout?.identityBand.heightInches ?? 0);

function updateIdentityHeight(event: Event): void {
    const height = Number((event.target as HTMLInputElement).value);
    if (Number.isFinite(height)) catalog.updateIdentityBandHeight(height);
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
