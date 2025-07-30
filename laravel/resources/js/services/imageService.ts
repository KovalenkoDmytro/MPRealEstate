export const imageService = {
    // Validate max gallery images
    canAddImages(currentCount: number, newCount: number, max = 7) {
        return currentCount + newCount <= max;
    },

    // Create preview URLs for new images
    createPreviews(files: File[]): { file: File; url: string }[] {
        return files.map((file) => ({file, url: URL.createObjectURL(file),}));
    },

    // Remove image and return updated arrays
    removeGalleryImage(index: number, previews: { id?: number; file?: File; url: string }[], removeIds: number[]) {
        const updatedPreviews = [...previews];
        const removed = updatedPreviews[index];
        if (removed.id) removeIds.push(removed.id);
        updatedPreviews.splice(index, 1);

        return {updatedPreviews, updatedRemoveIds: removeIds};
    },

    // Clear preview URL (main image or gallery) when removed
    revokePreview(url: string) {
        URL.revokeObjectURL(url);
    },
};
