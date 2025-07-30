import React from "react";

interface GalleryImagePreview {
    id?: number;
    file?: File;
    url: string;
}

interface ImagesState {
    previewMainImage: string | null;
    previewGalleryImages: GalleryImagePreview[];
    totalGalleryImages: number;
}

interface ImagesHandlers {
    handleMainImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    removeMainImage: () => void;
    handleGalleryImagesChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    removeGalleryImage: (index: number) => void;
}

interface Props {
    images: ImagesState;
    handlers: ImagesHandlers;
    disableGalleryUpload?: boolean;
}

export default function ListingImagesSection({ images, handlers, disableGalleryUpload }: Props) {
    const {previewMainImage, previewGalleryImages, totalGalleryImages,} = images;

    const {handleMainImageChange, removeMainImage, handleGalleryImagesChange, removeGalleryImage,} = handlers;

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-4">📸 Images</h3>

            {/* Main Image */}
            <div className="mb-4">
                <label className="block mb-1 font-medium">Main Image</label>
                <input type="file" accept="image/*" onChange={handleMainImageChange} className="file-input w-full" />
                {previewMainImage && (
                    <div className="mt-2 relative inline-block">
                        <img
                            src={previewMainImage}
                            alt="Preview"
                            className="w-40 h-28 object-cover rounded-lg"
                        />
                        <button
                            type="button"
                            onClick={removeMainImage}
                            className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full px-2"
                        >
                            ❌
                        </button>
                    </div>
                )}
            </div>

            {/* Gallery Images */}
            <div>
                <label className="block mb-1 font-medium">Gallery Images</label>
                <p className="text-sm text-gray-500">
                    {totalGalleryImages} of 7 images selected
                </p>
                <input
                    type="file"
                    accept="image/*"
                    disabled={disableGalleryUpload || previewGalleryImages.length >= 7}
                    multiple
                    onChange={handleGalleryImagesChange}
                    className="file-input w-full"
                />
                <div className="flex gap-2 mt-2 flex-wrap">
                    {previewGalleryImages.map((image, index) => (
                        <div key={index} className="relative inline-block">
                            <img
                                src={image.url}
                                alt="Preview"
                                className="w-16 h-16 object-cover rounded-lg"
                            />
                            <button
                                type="button"
                                onClick={() => removeGalleryImage(index)}
                                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs"
                            >
                                ❌
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
