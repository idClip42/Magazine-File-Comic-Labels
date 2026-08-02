<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";
import type { LabelConfig } from "../../../../src/core/types";
import { useCatalogStore } from "../../stores/catalog";

// All label editors share one open browser so the page stays compact while
// comparing covers.
const openArtworkBrowserId = ref<string>();

watch(openArtworkBrowserId, labelId => {
    document.body.classList.toggle("artwork-browser-open", Boolean(labelId));
});

const props = defineProps<{ label: LabelConfig }>();
const catalog = useCatalogStore();
const coverUrl = ref("");
const coverUrlError = ref("");
const artworkBrowser = ref<HTMLElement>();

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

async function openArtworkBrowser(): Promise<void> {
    openArtworkBrowserId.value = props.label.id;
    await nextTick();
    artworkBrowser.value?.focus();
}

function closeArtworkBrowser(): void {
    openArtworkBrowserId.value = undefined;
}

function selectArtworkFromBrowser(asset: string): void {
    catalog.selectArtwork(props.label.id, asset);
    closeArtworkBrowser();
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
            @click="openArtworkBrowser"
        >
            Browse covers
        </button>
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
    <Teleport to="body">
        <div
            v-if="isArtworkBrowserOpen"
            class="artwork-browser-backdrop"
            @click.self="closeArtworkBrowser"
        >
            <section
                ref="artworkBrowser"
                :id="`artwork-browser-${label.id}`"
                class="artwork-browser"
                role="dialog"
                aria-modal="true"
                :aria-label="`Choose cover for ${label.id}`"
                tabindex="-1"
                @keydown.esc="closeArtworkBrowser"
            >
                <header class="artwork-browser-header">
                    <h2>Choose a cover</h2>
                    <button
                        type="button"
                        aria-label="Close cover picker"
                        @click="closeArtworkBrowser"
                    >
                        ×
                    </button>
                </header>
                <div
                    class="artwork-browser-grid"
                    :class="{
                        'artwork-browser-grid-medium':
                            options.length > 15 && options.length <= 25,
                        'artwork-browser-grid-compact':
                            options.length > 25 && options.length <= 35,
                        'artwork-browser-grid-dense': options.length > 35,
                    }"
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
            </section>
        </div>
    </Teleport>
</template>
