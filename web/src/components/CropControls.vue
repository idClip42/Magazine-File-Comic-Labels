<script setup lang="ts">
import { computed } from "vue";
import type { LabelConfig } from "../../../src/types";
import { useCatalogStore } from "../stores/catalog";

const props = defineProps<{ label: LabelConfig }>();
const catalog = useCatalogStore();

const zoom = computed(() => `${Math.round(props.label.art.crop.scale * 100)}%`);
</script>

<template>
  <section class="crop-controls" :aria-label="`Crop controls for ${label.id}`">
    <div>
      <div class="crop-controls-title">Crop</div>
      <div class="crop-controls-help">Left/middle drag to pan · Ctrl/Cmd + scroll to zoom</div>
    </div>
    <output :aria-label="`Zoom ${zoom}`">{{ zoom }}</output>
    <button
      type="button"
      :disabled="!catalog.isSaveAvailable || catalog.isSaving || catalog.isCropSaved(label.id)"
      @click="catalog.saveArtwork(label.id)"
    >Save</button>
    <button
      type="button"
      :disabled="catalog.isCropSaved(label.id)"
      @click="catalog.revertCrop(label.id)"
    >Revert</button>
  </section>
</template>
