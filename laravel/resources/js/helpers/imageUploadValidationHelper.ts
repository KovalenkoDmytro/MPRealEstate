export const FALLBACK_MAX_IMAGE_SIZE_BYTES = 4 * 1024 * 1024;
export const MAX_GALLERY_IMAGES = 5;

export const ALLOWED_IMAGE_TYPES = new Set([
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/webp",
]);

export function resolveMaxImageSizeBytes(rawLimit?: number): number {
    return Number.isFinite(rawLimit) && (rawLimit ?? 0) > 0
        ? Number(rawLimit)
        : FALLBACK_MAX_IMAGE_SIZE_BYTES;
}

export function formatMaxImageSizeLabel(bytes: number): string {
    return `${Math.round((bytes / (1024 * 1024)) * 100) / 100}MB`;
}

export function validateImageFile(file: File, maxImageSizeBytes: number, subject: string): string | null {
    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
        return `${subject} must be a JPG, PNG, or WEBP file.`;
    }

    if (file.size > maxImageSizeBytes) {
        return `${subject} must not exceed ${formatMaxImageSizeLabel(maxImageSizeBytes)}.`;
    }

    return null;
}

export function validateImageFiles(files: File[], maxImageSizeBytes: number, subject: string): string | null {
    const invalidByType = files.find((file) => !ALLOWED_IMAGE_TYPES.has(file.type));
    if (invalidByType) {
        return `${subject} must be a JPG, PNG, or WEBP file.`;
    }

    const invalidBySize = files.find((file) => file.size > maxImageSizeBytes);
    if (invalidBySize) {
        return `${subject} must not exceed ${formatMaxImageSizeLabel(maxImageSizeBytes)}.`;
    }

    return null;
}
