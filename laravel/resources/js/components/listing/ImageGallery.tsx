import React from 'react';

interface ImageGalleryProps {
  mainImage: { image_path: string } | null;
  images: Array<{ id: number; image_path: string }>;
}

export const ImageGallery = ({ mainImage, images }: ImageGalleryProps) => (
  <div className="w-full max-w-3xl mx-auto">
    {mainImage ? (
      <img
        src={mainImage.image_path}
        alt="Main Image"
        className="w-full h-72 object-cover rounded-lg shadow-md"
      />
    ) : (
      <div className="w-full h-72 bg-gray-200 flex items-center justify-center text-gray-500">
        No Image Available
      </div>
    )}

    {images && images.length > 0 && (
      <div className="grid grid-cols-3 gap-2 mt-4">
        {images.map((img) => (
          <img
            key={img.id}
            src={img.image_path}
            alt="Gallery"
            className="h-24 w-full object-cover rounded-md"
          />
        ))}
      </div>
    )}
  </div>
);
