/// <reference types="vite/client" />

import type { EditorConfig } from "../../src/core/types";

declare global {
    interface Window {
        __COMIC_LABELS_CONFIG__?: EditorConfig;
    }
}

export {};
