<script setup lang="ts">
import {
    computed,
    nextTick,
    onBeforeUnmount,
    onBeforeUpdate,
    onMounted,
    ref,
    watch,
} from "vue";
import type { LabelConfig } from "../../../src/types";
import { useCatalogStore } from "../stores/catalog";
import LabelFace from "./LabelFace.vue";

const catalog = useCatalogStore();
const shelfSlots = ref<HTMLElement[]>([]);
let resizeObserver: ResizeObserver | undefined;

type Shelf = LabelConfig[];
const bookcases = computed<Shelf[][]>(() => {
    const shelves: Shelf[] = [];
    for (let index = 0; index < catalog.labels.length; index += 7) {
        shelves.push(catalog.labels.slice(index, index + 7));
    }

    const grouped: Shelf[][] = [];
    for (let index = 0; index < shelves.length; index += 6) {
        const bookcaseShelves = shelves.slice(index, index + 6);
        while (bookcaseShelves.length < 6) bookcaseShelves.push([]);
        grouped.push(bookcaseShelves);
    }
    return grouped;
});

function setShelfSlot(slot: unknown): void {
    if (slot instanceof HTMLElement) shelfSlots.value.push(slot);
}

function updateLabelScale(): void {
    for (const slot of shelfSlots.value) {
        const label = slot.querySelector<HTMLElement>(".label");
        if (!label || !slot.clientWidth || !label.offsetWidth) continue;
        slot.style.setProperty("--shelf-label-scale", String(slot.clientWidth / label.offsetWidth));
    }
}

watch(
    () => catalog.view,
    async view => {
        if (view === "shelves") {
            await nextTick();
            updateLabelScale();
        }
    },
);

onBeforeUpdate(() => {
    shelfSlots.value = [];
});

onMounted(() => {
    resizeObserver = new ResizeObserver(updateLabelScale);
    resizeObserver.observe(document.documentElement);
    nextTick(updateLabelScale);
});

onBeforeUnmount(() => resizeObserver?.disconnect());
</script>

<template>
  <section class="shelf-view" aria-label="Bookshelf overview">
    <div class="bookcase-wall">
      <section
        v-for="(bookcase, bookcaseIndex) in bookcases"
        :key="bookcaseIndex"
        class="bookcase"
        :aria-label="`Bookcase ${bookcaseIndex + 1}`"
      >
        <div v-for="(shelf, shelfIndex) in bookcase" :key="shelfIndex" class="bookshelf-row">
          <div class="shelf-labels">
            <div
              v-for="label in shelf"
              :key="label.id"
              :ref="setShelfSlot"
              class="shelf-label-slot"
            >
              <LabelFace :label="label" />
            </div>
          </div>
          <div class="shelf-spare-space" aria-hidden="true" />
        </div>
      </section>
    </div>
  </section>
</template>
