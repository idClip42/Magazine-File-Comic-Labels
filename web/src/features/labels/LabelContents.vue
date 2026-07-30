<script setup lang="ts">
import type { LabelConfig } from "../../../../src/core/types";

defineProps<{ label: LabelConfig }>();

function formatRange(range: [number, number], prefix = ""): string {
    const [start, end] = range;
    return start === end ? `${prefix}${start}` : `${prefix}${start}–${end}`;
}
</script>

<template>
  <div v-for="(content, index) in label.contents" :key="index" class="content-row">
    <span v-if="content.name" class="content-name">{{ content.name }}</span>
    <span v-if="content.volume" class="content-volume">Vol. {{ content.volume }}</span>
    <span v-if="content.issues" class="content-issues">{{ formatRange(content.issues, '#') }}</span>
  </div>
</template>
