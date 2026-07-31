<script setup lang="ts">
import type { LabelConfig } from "../../../../src/core/types";
import ArtworkOptions from "./ArtworkOptions.vue";
import CropControls from "./CropControls.vue";
import LabelFace from "./LabelFace.vue";

defineProps<{ label: LabelConfig }>();
</script>

<template>
    <div class="label-editor">
        <LabelFace :label="label" />
        <ArtworkOptions :label="label" />
        <CropControls :label="label" />
    </div>
</template>
