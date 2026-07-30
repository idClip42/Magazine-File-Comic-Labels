<script setup lang="ts">
import { watch } from "vue";
import { layoutCssVariables } from "./layout-css";
import { useCatalogStore } from "./stores/catalog";
import GlobalControls from "./features/editor/GlobalControls.vue";
import LabelEditor from "./features/labels/LabelEditor.vue";
import ShelfOverview from "./features/shelf/ShelfOverview.vue";
import ViewSwitcher from "./features/navigation/ViewSwitcher.vue";

const catalog = useCatalogStore();

watch(
    () => catalog.layout,
    layout => {
        if (!layout) return;
        for (const [name, value] of Object.entries(layoutCssVariables(layout))) {
            document.documentElement.style.setProperty(name, value);
        }
    },
    { deep: true, immediate: true },
);

void catalog.refreshFromServer();
</script>

<template>
  <main v-if="catalog.config" class="app" :class="`${catalog.view}-view`">
    <ViewSwitcher />
    <GlobalControls v-if="catalog.view === 'editor'" />

    <section class="label-grid" aria-label="Comic magazine-file labels">
      <LabelEditor v-for="label in catalog.labels" :key="label.id" :label="label" />
    </section>
    <ShelfOverview />
  </main>
  <main v-else class="loading-state">Loading label configuration…</main>
</template>
