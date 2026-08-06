<script setup lang="ts">
import { computed, watch } from "vue";
import GlobalControls from "./features/editor/GlobalControls.vue";
import LabelEditor from "./features/labels/LabelEditor.vue";
import ViewSwitcher from "./features/navigation/ViewSwitcher.vue";
import ShelfOverview from "./features/shelf/ShelfOverview.vue";
import { layoutCssVariables } from "./layout-css";
import { useCatalogStore } from "./stores/catalog";

const catalog = useCatalogStore();

const printVariables = computed(() => {
    const layout = catalog.layout;
    if (!layout || catalog.printLayout === "single") return {};

    const labelWidth = layout.face.widthInches + layout.overwrapInches * 2;
    const labelHeight = layout.face.heightInches;
    const labelCount = Math.max(catalog.filteredLabels.length, 1);
    const columns =
        catalog.printLayout === "two"
            ? 2
            : catalog.printLayout === "three"
              ? 3
              : Math.ceil(
                    Math.sqrt(labelCount * (labelHeight / labelWidth)),
                );
    const rows =
        catalog.printLayout === "all" ? Math.ceil(labelCount / columns) : 1;

    return {
        "--print-columns": String(columns),
        "--print-label-width": `${labelWidth}in`,
        "--print-label-height": `${labelHeight}in`,
        "--print-page-width": `${labelWidth * columns}in`,
        "--print-page-height": `${labelHeight * rows}in`,
    };
});

// @page rules resolve custom properties from :root rather than from the
// printed grid, so mirror the selected batch dimensions there.
watch(
    printVariables,
    variables => {
        for (const [name, value] of Object.entries(variables)) {
            document.documentElement.style.setProperty(name, value);
        }
    },
    { immediate: true },
);

watch(
    () => catalog.layout,
    layout => {
        if (!layout) return;
        for (const [name, value] of Object.entries(
            layoutCssVariables(layout),
        )) {
            document.documentElement.style.setProperty(name, value);
        }
    },
    { deep: true, immediate: true },
);

void catalog.refreshFromServer();
</script>

<template>
    <main
        v-if="catalog.config"
        class="app"
        :class="[`${catalog.view}-view`, `print-${catalog.printLayout}`]"
        :style="printVariables"
    >
        <ViewSwitcher />
        <GlobalControls v-if="catalog.view === 'editor'" />

        <section
            class="label-grid"
            aria-label="Comic magazine-file labels"
        >
            <LabelEditor
                v-for="label in catalog.filteredLabels"
                :key="label.id"
                :label="label"
            />
        </section>
        <ShelfOverview />
    </main>
    <main
        v-else
        class="loading-state"
    >
        Loading label configuration…
    </main>
</template>
