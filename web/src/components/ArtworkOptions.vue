<script setup lang="ts">
import { computed } from "vue";
import type { LabelConfig } from "../../../src/types";
import { useCatalogStore } from "../stores/catalog";

const props = defineProps<{ label: LabelConfig }>();
const catalog = useCatalogStore();

const options = computed(() => {
    const configured = props.label.art.options ?? [];
    return configured.includes(props.label.art.asset)
        ? configured
        : [props.label.art.asset, ...configured];
});
</script>

<template>
  <section
    v-if="options.length > 0"
    class="artwork-options"
    :aria-label="`Artwork options for ${label.id}`"
  >
    <span class="artwork-options-title">Cover</span>
    <div class="artwork-options-list">
      <button
        v-for="(asset, index) in options"
        :key="asset"
        class="artwork-option"
        :class="{ selected: asset === label.art.asset }"
        type="button"
        :aria-label="`Select cover option ${index + 1}`"
        :aria-pressed="asset === label.art.asset"
        @click="catalog.selectArtwork(label.id, asset)"
      >
        <img :src="catalog.artworkUrl(asset)" :alt="`Cover option ${index + 1}`" loading="lazy" />
        <span>{{ index + 1 }}</span>
      </button>
    </div>
  </section>
</template>
