import { useState } from 'react';
import { Box, ButtonBase, IconButton, Typography } from '@mui/material';
import { ChevronLeftRounded, ChevronRightRounded, OpenInFullRounded } from '@mui/icons-material';
import { GalleryLightbox } from '@/components/listing/ImageGallery/GalleryLightbox';
import { neutral, primary, radius } from '@/design/tokens';

type DealGalleryProps = {
    title: string;
    mainImage?: string;
    images: string[];
};

export default function DealGallery({ title, mainImage, images }: DealGalleryProps) {
    const imagePaths = [...new Set([mainImage, ...images].filter((path): path is string => Boolean(path)))];
    const hasPhotos = imagePaths.length > 0;
    const photos = hasPhotos ? imagePaths : ['/images/placeholder-house.jpg'];
    const [activeIndex, setActiveIndex] = useState(0);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const currentIndex = Math.min(activeIndex, photos.length - 1);

    return (
        <Box sx={{ minWidth: 0, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ position: 'relative', flex: 1, aspectRatio: { xs: '4 / 3', md: 'auto' }, minHeight: { md: 240 }, borderRadius: radius.md, overflow: 'hidden', bgcolor: neutral[200] }}>
                <ButtonBase disabled={!hasPhotos} onClick={() => setLightboxOpen(true)} aria-label={`Open photo ${currentIndex + 1} of ${photos.length} for ${title}`} sx={{ position: 'absolute', inset: 0, display: 'block', width: '100%', height: '100%', '&:focus-visible': { outline: `3px solid ${primary[400]}`, outlineOffset: -3 } }}>
                    <Box component="img" src={photos[currentIndex]} alt={`${title}, photo ${currentIndex + 1}`} loading="lazy" sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </ButtonBase>
                <Typography variant="caption" sx={{ position: 'absolute', top: 12, left: 12, px: 1.25, py: 0.5, bgcolor: 'rgba(23,26,34,0.7)', color: neutral[0], borderRadius: radius.sm, pointerEvents: 'none' }}>
                    {hasPhotos ? `${currentIndex + 1} / ${photos.length}` : 'No photos available'}
                </Typography>
                {hasPhotos && <Box sx={{ position: 'absolute', bottom: 12, right: 12, p: 0.75, display: 'flex', bgcolor: 'rgba(23,26,34,0.7)', color: neutral[0], borderRadius: radius.sm, pointerEvents: 'none' }}><OpenInFullRounded sx={{ fontSize: 16 }} /></Box>}
                {photos.length > 1 && ([
                    { label: 'Previous photo', offset: -1, left: 10, icon: <ChevronLeftRounded /> },
                    { label: 'Next photo', offset: 1, right: 10, icon: <ChevronRightRounded /> },
                ]).map((control) => (
                    <IconButton key={control.label} aria-label={control.label} onClick={() => setActiveIndex((currentIndex + control.offset + photos.length) % photos.length)} sx={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: control.left, right: control.right, width: 32, height: 32, bgcolor: neutral[0], color: neutral[800], boxShadow: '0 2px 8px rgba(0,0,0,0.15)', '&:hover': { bgcolor: primary[50] } }}>{control.icon}</IconButton>
                ))}
            </Box>
            {photos.length > 1 && (
                <Box role="group" aria-label="Property photos" sx={{ display: 'flex', flexShrink: 0, gap: 1, overflowX: 'auto', pt: 1.5, pb: 0.5, px: 0.25 }}>
                    {photos.map((path, index) => (
                        <ButtonBase key={path} aria-label={`Show photo ${index + 1} of ${photos.length}`} aria-pressed={currentIndex === index} onClick={() => setActiveIndex(index)} sx={{ flexShrink: 0, width: 64, height: 50, borderRadius: radius.sm, p: 0.25, border: `2px solid ${currentIndex === index ? primary[600] : 'transparent'}`, opacity: currentIndex === index ? 1 : 0.65, '&:hover': { opacity: 1 }, '&:focus-visible': { outline: `2px solid ${primary[600]}`, outlineOffset: 2 } }}>
                            <Box component="img" src={path} alt="" loading="lazy" sx={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '6px' }} />
                        </ButtonBase>
                    ))}
                </Box>
            )}
            <GalleryLightbox open={lightboxOpen} initialIndex={currentIndex} images={photos.map((image_path) => ({ image_path }))} onClose={() => setLightboxOpen(false)} />
        </Box>
    );
}
