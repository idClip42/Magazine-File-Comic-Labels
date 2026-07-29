<script setup lang="ts">
import type { LabelConfig } from "../../../src/types";
import CropControls from "./CropControls.vue";
import ArtworkOptions from "./ArtworkOptions.vue";
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
