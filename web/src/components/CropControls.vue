<script setup lang="ts">
import type { LabelConfig } from "../../../src/types";
import { useCatalogStore } from "../stores/catalog";

const props = defineProps<{ label: LabelConfig }>();
const catalog = useCatalogStore();

type CropField = "x" | "y" | "scale";

const limits: Record<CropField, { min: number; max: number }> = {
    x: { min: 0, max: 1 },
    y: { min: 0, max: 1 },
    scale: { min: 0.5, max: 5 },
};

function update(field: CropField, input: Event): void {
    const value = Number((input.target as HTMLInputElement).value);
    const { min, max } = limits[field];
    if (!Number.isFinite(value) || value < min || value > max) return;

    const crop = {
        focus: {
            x: props.label.art.crop.focus.x,
            y: props.label.art.crop.focus.y,
        },
        scale: props.label.art.crop.scale,
    };
    if (field === "x" || field === "y") crop.focus[field] = value;
    else crop.scale = value;
    catalog.updateCrop(props.label.id, crop);
}
</script>

<template>
  <section class="crop-controls" :aria-label="`Crop controls for ${label.id}`">
    <div class="crop-controls-title">{{ label.id }} crop</div>
    <label>
      Focus X
      <input type="range" min="0" max="1" step="0.01" :value="label.art.crop.focus.x" @input="update('x', $event)" />
      <input type="number" min="0" max="1" step="0.01" :value="label.art.crop.focus.x" @input="update('x', $event)" />
    </label>
    <label>
      Focus Y
      <input type="range" min="0" max="1" step="0.01" :value="label.art.crop.focus.y" @input="update('y', $event)" />
      <input type="number" min="0" max="1" step="0.01" :value="label.art.crop.focus.y" @input="update('y', $event)" />
    </label>
    <label>
      Zoom
      <input type="range" min="0.5" max="5" step="0.01" :value="label.art.crop.scale" @input="update('scale', $event)" />
      <input type="number" min="0.5" max="5" step="0.01" :value="label.art.crop.scale" @input="update('scale', $event)" />
    </label>
  </section>
</template>
