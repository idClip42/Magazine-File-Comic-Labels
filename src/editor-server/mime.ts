import path from "node:path";

const imageTypes: Record<string, string> = {
    ".avif": "image/avif",
    ".gif": "image/gif",
    ".jpeg": "image/jpeg",
    ".jpg": "image/jpeg",
    ".png": "image/png",
    ".svg": "image/svg+xml",
    ".webp": "image/webp",
};

const applicationTypes: Record<string, string> = {
    ".css": "text/css; charset=utf-8",
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".map": "application/json; charset=utf-8",
    ".woff": "font/woff",
    ".woff2": "font/woff2",
};

export function imageTypeForPath(filePath: string): string | undefined {
    return imageTypes[path.extname(filePath).toLowerCase()];
}

export function applicationTypeForPath(filePath: string): string | undefined {
    const extension = path.extname(filePath).toLowerCase();
    return applicationTypes[extension] ?? imageTypeForPath(filePath);
}
