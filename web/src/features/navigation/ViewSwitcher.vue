<script setup lang="ts">
import { computed } from "vue";
import type { ViewMode } from "../../config";
import { useCatalogStore } from "../../stores/catalog";

const catalog = useCatalogStore();
const categories = computed(() =>
    Object.entries(catalog.config?.categories ?? {}).map(([id, category]) => ({
        id,
        name: category.name,
    })),
);

function selectView(view: ViewMode): void {
    catalog.view = view;
}

function selectCategory(event: Event): void {
    catalog.categoryFilter = (event.target as HTMLSelectElement).value;
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
        <label
            v-if="catalog.view === 'editor'"
            class="category-filter"
        >
            <span>Category</span>
            <select
                :value="catalog.categoryFilter"
                @change="selectCategory"
            >
                <option value="all">All labels</option>
                <option
                    v-for="category in categories"
                    :key="category.id"
                    :value="category.id"
                >
                    {{ category.name }}
                </option>
            </select>
        </label>
    </nav>
</template>
