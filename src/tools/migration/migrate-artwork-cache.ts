import { migrateLegacyArtworkCache } from "../../editor-server/artwork-cache";

const result = migrateLegacyArtworkCache();
if (result === "migrated") {
    console.log(
        "Moved the persistent artwork cache from dist/artwork-cache to .cache/artwork.",
    );
} else if (result === "already-migrated") {
    console.log("Persistent artwork cache already lives at .cache/artwork.");
} else {
    console.log("No legacy artwork cache was found to migrate.");
}
