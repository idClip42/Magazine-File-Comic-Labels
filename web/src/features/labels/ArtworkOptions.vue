<script setup lang="ts">
import { computed } from "vue";
import type { LabelConfig } from "../../../../src/core/types";
import { useCatalogStore } from "../../stores/catalog";

const props = defineProps<{ label: LabelConfig }>();
const catalog = useCatalogStore();

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

    return issues.length === options.value.length
        ? issues.map(String)
        : options.value.map((_, index) => String(index + 1));
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
    </section>
</template>
