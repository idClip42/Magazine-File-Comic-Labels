<script setup lang="ts">
import { computed, ref } from "vue";
import type { LabelConfig } from "../../../../src/core/types";
import { useCatalogStore } from "../../stores/catalog";

// All label editors share one open browser so the page stays compact while
// comparing covers.
const openArtworkBrowserId = ref<string>();

const props = defineProps<{ label: LabelConfig }>();
const catalog = useCatalogStore();
const coverUrl = ref("");
const coverUrlError = ref("");

const options = computed(() => {
    const configured = props.label.art.options ?? [];
    return configured.includes(props.label.art.asset)
        ? configured
        : [props.label.art.asset, ...configured];
});

const optionLabels = computed(() => {
    const issues = props.label.contents.flatMap(content => {
        if (!content.issues) return [];
        const [start, end] = content.issues;
        return Array.from(
            { length: end - start + 1 },
            (_, offset) => start + offset,
        );
    });

    if (issues.length === 0)
        return options.value.map((_, index) => String(index + 1));
    return options.value.map((_, index) =>
        index < issues.length
            ? String(issues[index])
            : `New ${index - issues.length + 1}`,
    );
});

const currentOptionIndex = computed(() =>
    options.value.indexOf(props.label.art.asset),
);
const isArtworkBrowserOpen = computed(
    () => openArtworkBrowserId.value === props.label.id,
);

function selectRelativeArtwork(direction: -1 | 1): void {
    const nextIndex = currentOptionIndex.value + direction;
    const nextAsset = options.value[nextIndex];
    if (nextAsset) catalog.selectArtwork(props.label.id, nextAsset);
}

function toggleArtworkBrowser(): void {
    openArtworkBrowserId.value = isArtworkBrowserOpen.value
        ? undefined
        : props.label.id;
}

function selectArtworkFromBrowser(asset: string): void {
    catalog.selectArtwork(props.label.id, asset);
    openArtworkBrowserId.value = undefined;
}

function addCoverUrl(): void {
    const error = catalog.addArtworkUrl(props.label.id, coverUrl.value);
    if (error) {
        coverUrlError.value = error;
        return;
    }
    coverUrl.value = "";
    coverUrlError.value = "";
}
</script>

<template>
    <section
        v-if="options.length > 0"
        class="artwork-options"
        :aria-label="`Artwork options for ${label.id}`"
    >
        <span class="artwork-options-title">Cover</span>
        <div
            v-if="options.length > 1"
            class="artwork-option-navigation"
            aria-label="Cover navigation"
        >
            <button
                type="button"
                :disabled="currentOptionIndex <= 0"
                aria-label="Previous cover"
                title="Previous cover"
                @click="selectRelativeArtwork(-1)"
            >
                ←
            </button>
            <button
                type="button"
                :disabled="currentOptionIndex >= options.length - 1"
                aria-label="Next cover"
                title="Next cover"
                @click="selectRelativeArtwork(1)"
            >
                →
            </button>
        </div>
        <div class="artwork-options-list">
            <label
                v-for="(asset, index) in options"
                :key="asset"
                class="artwork-option"
                :title="`Select cover ${optionLabels[index]}`"
            >
                <input
                    type="radio"
                    :name="`artwork-option-${label.id}`"
                    :checked="asset === label.art.asset"
                    :aria-label="`Select cover ${optionLabels[index]}`"
                    @change="catalog.selectArtwork(label.id, asset)"
                />
                <span>{{ optionLabels[index] }}</span>
            </label>
        </div>
        <button
            v-if="options.length > 1"
            type="button"
            class="artwork-browser-toggle"
            :aria-expanded="isArtworkBrowserOpen"
            :aria-controls="`artwork-browser-${label.id}`"
            @click="toggleArtworkBrowser"
        >
            {{ isArtworkBrowserOpen ? "Hide covers" : "Browse covers" }}
        </button>
        <div
            v-if="isArtworkBrowserOpen"
            :id="`artwork-browser-${label.id}`"
            class="artwork-browser"
            aria-label="Cover thumbnails"
        >
            <button
                v-for="(asset, index) in options"
                :key="asset"
                type="button"
                class="artwork-browser-option"
                :class="{ selected: asset === label.art.asset }"
                :aria-label="`Select cover ${optionLabels[index]}`"
                :aria-pressed="asset === label.art.asset"
                @click="selectArtworkFromBrowser(asset)"
            >
                <img
                    :src="catalog.artworkUrl(asset)"
                    :alt="`Cover ${optionLabels[index]}`"
                />
                <span>{{ optionLabels[index] }}</span>
            </button>
        </div>
        <form
            class="artwork-url-form"
            @submit.prevent="addCoverUrl"
        >
            <label>
                <span class="visually-hidden">Cover URL</span>
                <input
                    v-model="coverUrl"
                    type="url"
                    inputmode="url"
                    placeholder="Cover URL"
                    aria-label="Cover URL"
                />
            </label>
            <button type="submit">Add &amp; select</button>
        </form>
        <p
            v-if="coverUrlError || catalog.artworkError(label.id)"
            class="artwork-url-error"
        >
            {{ coverUrlError || catalog.artworkError(label.id) }}
        </p>
    </section>
</template>
