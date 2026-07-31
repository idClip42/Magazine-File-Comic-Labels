<script setup lang="ts">
import type { ViewMode } from "../../config";
import { useCatalogStore } from "../../stores/catalog";

const catalog = useCatalogStore();

function selectView(view: ViewMode): void {
    catalog.view = view;
}
</script>

<template>
    <nav
        class="view-switcher"
        aria-label="Label views"
    >
        <button
            type="button"
            :aria-pressed="catalog.view === 'editor'"
            @click="selectView('editor')"
        >
            Edit labels
        </button>
        <button
            type="button"
            :aria-pressed="catalog.view === 'shelves'"
            @click="selectView('shelves')"
        >
            Shelf overview
        </button>
    </nav>
</template>
