<script setup lang="ts">
import { computed } from "vue";
import { maximumMetadataBandHeight } from "../../../../src/core/layout";
import type { ArtTreatment, LayoutConfig } from "../../../../src/core/types";
import type { PrintLayout } from "../../stores/catalog";
import { useCatalogStore } from "../../stores/catalog";

const catalog = useCatalogStore();
const metadataBandHeightMaximum = computed(() =>
    catalog.layout ? maximumMetadataBandHeight(catalog.layout) : 2,
);

function numberValue(event: Event): number | undefined {
    const value = Number((event.target as HTMLInputElement).value);
    return Number.isFinite(value) ? value : undefined;
}

function updateArtTreatment(field: keyof ArtTreatment, event: Event): void {
    const layout = catalog.layout;
    if (!layout) return;
    const value =
        field === "tintBlendMode"
            ? ((event.target as HTMLSelectElement)
                  .value as ArtTreatment["tintBlendMode"])
            : numberValue(event);
    if (value === undefined) return;
    catalog.updateLayout({
        artTreatment: { ...layout.artTreatment, [field]: value },
    });
}

function updateBandHeight(
    field: "identityBandHeightInches" | "metadataBandHeightInches",
    event: Event,
): void {
    const value = numberValue(event);
    if (value !== undefined) catalog.updateLayout({ [field]: value });
}

function updateTypography(
    field: keyof LayoutConfig["typography"],
    event: Event,
): void {
    const layout = catalog.layout;
    const value = numberValue(event);
    if (!layout || value === undefined) return;
    catalog.updateLayout({
        typography: { ...layout.typography, [field]: value },
    });
}

function updateMutedLogoSaturation(event: Event): void {
    const layout = catalog.layout;
    const value = numberValue(event);
    if (!layout || value === undefined) return;
    catalog.updateLayout({
        logoPalette: {
            ...layout.logoPalette,
            mutedSaturationMultiplier: value,
        },
    });
}

function updateLogoOutline(
    field: keyof LayoutConfig["logoOutline"],
    event: Event,
): void {
    const layout = catalog.layout;
    if (!layout) return;
    const input = event.target as HTMLInputElement | HTMLSelectElement;
    const value =
        field === "enabled"
            ? (input as HTMLInputElement).checked
            : field === "widthPixels"
              ? numberValue(event)
              : input.value;
    if (value === undefined) return;
    catalog.updateLayout({
        logoOutline: { ...layout.logoOutline, [field]: value },
    });
}

function updatePrintLayout(event: Event): void {
    catalog.selectPrintLayout(
        (event.target as HTMLSelectElement).value as PrintLayout,
    );
}

function printPdf(): void {
    window.print();
}
</script>

<template>
    <aside
        class="global-controls"
        aria-label="Global label controls"
        aria-live="polite"
    >
        <div
            class="design-variant-control"
            role="group"
            aria-label="Design comparison"
        >
            <span>Editing design</span>
            <button
                type="button"
                :aria-pressed="catalog.activeDesignVariant === 'A'"
                @click="catalog.selectDesignVariant('A')"
            >
                A
            </button>
            <button
                type="button"
                :aria-pressed="catalog.activeDesignVariant === 'B'"
                @click="catalog.selectDesignVariant('B')"
            >
                B
            </button>
        </div>
        <details>
            <summary>Artwork treatment</summary>
            <label>
                Saturation
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    :value="catalog.layout?.artTreatment.saturation"
                    @input="updateArtTreatment('saturation', $event)"
                />
                <output>{{
                    catalog.layout?.artTreatment.saturation.toFixed(2)
                }}</output>
            </label>
            <label>
                Contrast
                <input
                    type="range"
                    min="0.5"
                    max="1.5"
                    step="0.01"
                    :value="catalog.layout?.artTreatment.contrast"
                    @input="updateArtTreatment('contrast', $event)"
                />
                <output>{{
                    catalog.layout?.artTreatment.contrast.toFixed(2)
                }}</output>
            </label>
            <label>
                Brightness
                <input
                    type="range"
                    min="0.5"
                    max="1.5"
                    step="0.01"
                    :value="catalog.layout?.artTreatment.brightness"
                    @input="updateArtTreatment('brightness', $event)"
                />
                <output>{{
                    catalog.layout?.artTreatment.brightness.toFixed(2)
                }}</output>
            </label>
            <label>
                Tint opacity
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    :value="catalog.layout?.artTreatment.tintOpacity"
                    @input="updateArtTreatment('tintOpacity', $event)"
                />
                <output>{{
                    catalog.layout?.artTreatment.tintOpacity.toFixed(2)
                }}</output>
            </label>
            <label>
                Tint blend
                <select
                    :value="catalog.layout?.artTreatment.tintBlendMode"
                    @change="updateArtTreatment('tintBlendMode', $event)"
                >
                    <option value="color">Color</option>
                    <option value="multiply">Multiply</option>
                    <option value="overlay">Overlay</option>
                    <option value="soft-light">Soft light</option>
                </select>
            </label>
        </details>

        <details>
            <summary>Bands</summary>
            <label>
                Identity height
                <input
                    type="range"
                    min="0.5"
                    max="3.5"
                    step="0.01"
                    :value="catalog.layout?.identityBand.heightInches"
                    @input="
                        updateBandHeight('identityBandHeightInches', $event)
                    "
                />
                <output
                    >{{
                        catalog.layout?.identityBand.heightInches.toFixed(2)
                    }}″</output
                >
            </label>
            <label>
                Metadata height
                <input
                    type="range"
                    min="0.5"
                    :max="metadataBandHeightMaximum"
                    step="0.01"
                    :value="catalog.layout?.metadataBand.heightInches"
                    @input="
                        updateBandHeight('metadataBandHeightInches', $event)
                    "
                />
                <output
                    >{{
                        catalog.layout?.metadataBand.heightInches.toFixed(2)
                    }}″</output
                >
            </label>
        </details>

        <details>
            <summary>Typography</summary>
            <label>
                Years size
                <input
                    type="range"
                    min="0.15"
                    max="0.5"
                    step="0.01"
                    :value="catalog.layout?.typography.yearsSizeInches"
                    @input="updateTypography('yearsSizeInches', $event)"
                />
                <output
                    >{{
                        catalog.layout?.typography.yearsSizeInches.toFixed(2)
                    }}″</output
                >
            </label>
            <label>
                Metadata size
                <input
                    type="range"
                    min="0.08"
                    max="0.25"
                    step="0.01"
                    :value="catalog.layout?.typography.metadataSizeInches"
                    @input="updateTypography('metadataSizeInches', $event)"
                />
                <output
                    >{{
                        catalog.layout?.typography.metadataSizeInches.toFixed(
                            2,
                        )
                    }}″</output
                >
            </label>
            <label>
                Band gap
                <input
                    type="range"
                    min="0"
                    max="0.15"
                    step="0.005"
                    :value="catalog.layout?.typography.bandGapInches"
                    @input="updateTypography('bandGapInches', $event)"
                />
                <output
                    >{{
                        catalog.layout?.typography.bandGapInches.toFixed(3)
                    }}″</output
                >
            </label>
        </details>

        <details>
            <summary>Logo presentation</summary>
            <label>
                Muted saturation
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    :value="
                        catalog.layout?.logoPalette.mutedSaturationMultiplier
                    "
                    @input="updateMutedLogoSaturation"
                />
                <output>{{
                    catalog.layout?.logoPalette.mutedSaturationMultiplier.toFixed(
                        2,
                    )
                }}</output>
            </label>
            <label class="checkbox-control">
                <input
                    type="checkbox"
                    :checked="catalog.layout?.logoOutline.enabled"
                    @change="updateLogoOutline('enabled', $event)"
                />
                Outline enabled
            </label>
            <label>
                Outline color
                <input
                    type="color"
                    :value="catalog.layout?.logoOutline.color"
                    @input="updateLogoOutline('color', $event)"
                />
            </label>
            <label>
                Outline width
                <input
                    type="range"
                    min="0"
                    max="6"
                    step="1"
                    :value="catalog.layout?.logoOutline.widthPixels"
                    @input="updateLogoOutline('widthPixels', $event)"
                />
                <output
                    >{{ catalog.layout?.logoOutline.widthPixels }} px</output
                >
            </label>
            <label>
                Outline join
                <select
                    :value="catalog.layout?.logoOutline.lineJoin"
                    @change="updateLogoOutline('lineJoin', $event)"
                >
                    <option value="round">Round</option>
                    <option value="miter">Miter</option>
                    <option value="bevel">Bevel</option>
                </select>
            </label>
        </details>

        <details>
            <summary>Print PDF</summary>
            <label>
                Labels per page
                <select
                    :value="catalog.printLayout"
                    @change="updatePrintLayout"
                >
                    <option value="single">1 — full size</option>
                    <option value="two">2 — exact-size custom page</option>
                    <option value="three">3 — exact-size custom page</option>
                    <option value="all">All shown — one custom page</option>
                </select>
            </label>
            <p class="print-help">
                Labels stay at their exact print size and touch edge-to-edge.
                The category filter determines which labels are shown and printed.
            </p>
            <button
                type="button"
                @click="printPdf"
            >
                Print / save PDF
            </button>
        </details>

        <button
            type="button"
            :disabled="!catalog.isSaveAvailable || !catalog.hasPendingChanges"
            @click="catalog.saveChanges"
        >
            Save changes
        </button>
        <span>{{ catalog.saveStatus() }}</span>
    </aside>
</template>
