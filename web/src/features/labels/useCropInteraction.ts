import {
    computed,
    onBeforeUnmount,
    ref,
    type ComputedRef,
    type CSSProperties,
    type Ref,
} from "vue";
import {
    clamp,
    CROP_SCALE_MAX,
    CROP_SCALE_MIN,
    roundCropValue,
} from "../../../../src/core/crop";
import type { CropUpdate } from "../../../../src/core/editor-updates";
import type { LabelConfig } from "../../../../src/core/types";

export type CoverSize = { width: number; height: number };

type PanState = {
    pointerId: number;
    startClientX: number;
    startClientY: number;
    crop: CropUpdate;
};

type CropInteractionOptions = {
    /** Reads the current prop so the editor's server refresh cannot leave a stale label captured here. */
    label: () => LabelConfig;
    coverSize: ComputedRef<CoverSize | undefined>;
    imageAspectRatio: Ref<number | undefined>;
    isEditor: () => boolean;
    updateCrop: (crop: CropUpdate) => void;
};

function roundedCrop(
    focusX: number,
    focusY: number,
    scale: number,
): CropUpdate {
    return {
        focus: {
            x: roundCropValue(clamp(focusX, 0, 1), 4),
            y: roundCropValue(clamp(focusY, 0, 1), 4),
        },
        scale: roundCropValue(clamp(scale, CROP_SCALE_MIN, CROP_SCALE_MAX), 3),
    };
}

function focusAfterPan(
    startFocus: number,
    movement: number,
    frameSize: number,
    baseSize: number,
    scale: number,
): number {
    const panExtent = frameSize - baseSize * scale;
    // At 1x the fitted dimension has no overflow, so it has no pan movement.
    if (Math.abs(panExtent) < 0.001) return startFocus;
    return clamp(startFocus + movement / panExtent, 0, 1);
}

function focusAnchoredAtPointer(
    focus: number,
    pointer: number,
    frameSize: number,
    baseSize: number,
    previousScale: number,
    nextScale: number,
): number {
    const previousRenderedSize = baseSize * previousScale;
    const previousOffset = focus * (frameSize - previousRenderedSize);
    const sourcePosition = (pointer - previousOffset) / previousRenderedSize;
    const nextPanExtent = frameSize - baseSize * nextScale;
    if (Math.abs(nextPanExtent) < 0.001) return focus;
    return clamp(
        (pointer - sourcePosition * baseSize * nextScale) / nextPanExtent,
        0,
        1,
    );
}

/** Owns image metrics and pointer math; LabelFace remains focused on rendering. */
export function useCropInteraction(options: CropInteractionOptions) {
    const panState = ref<PanState>();
    const cropGuidesActive = ref(false);
    let cropGuideTimeout: ReturnType<typeof setTimeout> | undefined;

    const artImageStyle = computed<CSSProperties>(() => {
        const baseSize = options.coverSize.value;
        if (!baseSize) return {};
        const { focus, scale } = options.label().art.crop;
        const width = baseSize.width * scale;
        const height = baseSize.height * scale;
        return {
            inset: "auto",
            left: `${focus.x * (1 - width) * 100}%`,
            top: `${focus.y * (1 - height) * 100}%`,
            width: `${width * 100}%`,
            height: `${height * 100}%`,
            objectFit: "fill",
            transform: "none",
        };
    });

    function showCropGuides(linger = false): void {
        cropGuidesActive.value = true;
        if (cropGuideTimeout !== undefined) clearTimeout(cropGuideTimeout);
        if (linger) {
            cropGuideTimeout = setTimeout(() => {
                cropGuidesActive.value = false;
                cropGuideTimeout = undefined;
            }, 700);
        }
    }

    function hideCropGuides(): void {
        if (cropGuideTimeout !== undefined) clearTimeout(cropGuideTimeout);
        cropGuideTimeout = undefined;
        cropGuidesActive.value = false;
    }

    function measureArtwork(image: HTMLImageElement): void {
        if (image.naturalWidth === 0 || image.naturalHeight === 0) return;
        options.imageAspectRatio.value =
            image.naturalWidth / image.naturalHeight;
    }

    function onArtworkLoad(event: Event): void {
        measureArtwork(event.currentTarget as HTMLImageElement);
    }

    function startPan(event: PointerEvent): void {
        if (
            !options.isEditor() ||
            (event.button !== 0 && event.button !== 1) ||
            !event.isPrimary ||
            !options.coverSize.value
        )
            return;
        const label = event.currentTarget as HTMLElement;
        event.preventDefault();
        showCropGuides();
        label.setPointerCapture(event.pointerId);
        panState.value = {
            pointerId: event.pointerId,
            startClientX: event.clientX,
            startClientY: event.clientY,
            crop: {
                focus: { ...options.label().art.crop.focus },
                scale: options.label().art.crop.scale,
            },
        };
    }

    function panArtwork(event: PointerEvent): void {
        if (!options.isEditor()) return;
        const pan = panState.value;
        const baseSize = options.coverSize.value;
        if (!pan || pan.pointerId !== event.pointerId || !baseSize) return;

        const label = event.currentTarget as HTMLElement;
        const bounds = label.getBoundingClientRect();
        const focusX = focusAfterPan(
            pan.crop.focus.x,
            event.clientX - pan.startClientX,
            bounds.width,
            bounds.width * baseSize.width,
            pan.crop.scale,
        );
        const focusY = focusAfterPan(
            pan.crop.focus.y,
            event.clientY - pan.startClientY,
            bounds.height,
            bounds.height * baseSize.height,
            pan.crop.scale,
        );
        options.updateCrop(roundedCrop(focusX, focusY, pan.crop.scale));
    }

    function endPan(event: PointerEvent): void {
        if (panState.value?.pointerId !== event.pointerId) return;
        const label = event.currentTarget as HTMLElement;
        if (label.hasPointerCapture(event.pointerId))
            label.releasePointerCapture(event.pointerId);
        panState.value = undefined;
        hideCropGuides();
    }

    function wheelZoom(event: WheelEvent): void {
        if (!options.isEditor() || (!event.ctrlKey && !event.metaKey)) return;
        const baseSize = options.coverSize.value;
        if (!baseSize) return;

        event.preventDefault();
        showCropGuides(true);
        const label = event.currentTarget as HTMLElement;
        const bounds = label.getBoundingClientRect();
        const unit =
            event.deltaMode === WheelEvent.DOM_DELTA_LINE
                ? 16
                : event.deltaMode === WheelEvent.DOM_DELTA_PAGE
                  ? bounds.height
                  : 1;
        const previousCrop = options.label().art.crop;
        const scale = clamp(
            previousCrop.scale * Math.exp(-event.deltaY * unit * 0.0015),
            CROP_SCALE_MIN,
            CROP_SCALE_MAX,
        );
        if (scale === previousCrop.scale) return;

        const pointerX = clamp(event.clientX - bounds.left, 0, bounds.width);
        const pointerY = clamp(event.clientY - bounds.top, 0, bounds.height);
        options.updateCrop(
            roundedCrop(
                focusAnchoredAtPointer(
                    previousCrop.focus.x,
                    pointerX,
                    bounds.width,
                    bounds.width * baseSize.width,
                    previousCrop.scale,
                    scale,
                ),
                focusAnchoredAtPointer(
                    previousCrop.focus.y,
                    pointerY,
                    bounds.height,
                    bounds.height * baseSize.height,
                    previousCrop.scale,
                    scale,
                ),
                scale,
            ),
        );
    }

    onBeforeUnmount(hideCropGuides);
    return {
        artImageStyle,
        cropGuidesActive,
        panState,
        measureArtwork,
        onArtworkLoad,
        startPan,
        panArtwork,
        endPan,
        wheelZoom,
    };
}
