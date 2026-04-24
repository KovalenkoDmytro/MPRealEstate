import React, { useEffect, useRef, useState } from 'react';
import { createRoot, Root } from 'react-dom/client';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useTheme, Box, CircularProgress, Typography, IconButton } from '@mui/material';
import { Fullscreen, FullscreenExit, ChevronLeft, ChevronRight } from '@mui/icons-material';

// Define a lightweight type that matches our optimized Laravel endpoint
export type MapListing = {
    id: number;
    title: string;
    price: number;
    latitude: number;
    longitude: number;
    main_image: {
        image_path: string;
    } | null;
};

// --- React Component for the Popup Slider ---
const PopupContent = ({ listings, theme }: { listings: MapListing[], theme: any }) => {
    const [index, setIndex] = useState(0);
    const listing = listings[index];

    const next = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIndex((prev) => (prev + 1) % listings.length);
    };

    const prev = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIndex((prev) => (prev - 1 + listings.length) % listings.length);
    };

    const fullPrice = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(listing.price);
    const imageUrl = listing.main_image?.image_path || '/images/placeholder-house.jpg';

    // @ts-ignore
    const detailUrl = typeof route === 'function' ? route("listings.show", listing.id) : `/listings/${listing.id}`;

    return (
        <Box sx={{ p: 0.5, textAlign: 'center', width: '100%', position: 'relative', fontFamily: 'sans-serif' }}>
            <Box sx={{ position: 'relative', width: '100%', height: 320, mb: 1, borderRadius: 1.5, overflow: 'hidden' }}>
                <img src={imageUrl} alt={listing.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />

                {/* Carousel Controls (Only show if multiple listings) */}
                {listings.length > 1 && (
                    <>
                        <IconButton
                            size="medium"
                            onClick={prev}
                            sx={{ position: 'absolute', left: 4, top: '50%', transform: 'translateY(-50%)', bgcolor: 'rgba(255,255,255,0.8)', '&:hover': { bgcolor: 'white' }, width: 35, height: 35 }}
                        >
                            <ChevronLeft sx={{ fontSize: 16 }} />
                        </IconButton>
                        <IconButton
                            size="medium"
                            onClick={next}
                            sx={{ position: 'absolute', right: 4, top: '50%', transform: 'translateY(-50%)', bgcolor: 'rgba(255,255,255,0.8)', '&:hover': { bgcolor: 'white' }, width: 35, height: 35 }}
                        >
                            <ChevronRight sx={{ fontSize: 16 }} />
                        </IconButton>
                        <Box sx={{ position: 'absolute', top: 6, right: 6, bgcolor: 'rgba(0,0,0,0.6)', color: 'white', px: 1, py: 0.25, borderRadius: 1, fontSize: '15px', fontWeight: 500 }}>
                            {index + 1}/{listings.length}
                        </Box>
                    </>
                )}
            </Box>

            <Typography variant="subtitle1" noWrap sx={{ fontWeight: 700, color: '#1a202c', mb: 0.5 }}>
                {listing.title}
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 800, color: theme.palette.primary.main, mb: 1.5 }}>
                {fullPrice}
            </Typography>

            <a href={detailUrl} style={{ display: 'block', width: '100%', background: theme.palette.primary.main, color: 'white', padding: '8px 0', borderRadius: '6px', textDecoration: 'none', fontSize: '12px', fontWeight: 600 }}>
                View Details
            </a>
        </Box>
    );
};


type PropertyMapSelectorProps = {
    listings: MapListing[];
};

export default function PropertyMapSelector({ listings }: PropertyMapSelectorProps) {
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const markersRef = useRef<mapboxgl.Marker[]>([]);
    const popupRootsRef = useRef<Root[]>([]); // Track React roots to unmount them cleanly
    const selectedBuildingIdRef = useRef<string | number | null>(null);
    const theme = useTheme();

    const [isMapLoaded, setIsMapLoaded] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    // 2. Initialize Map (Runs ONLY once when component mounts)
    useEffect(() => {
        mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || 'YOUR_MAPBOX_ACCESS_TOKEN';

        if (!mapContainerRef.current || mapRef.current) return;

        // Initialize Map with a default center (Calgary) using streets-v12
        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [-114.0719, 51.0447],
            zoom: 11,
            pitch: 45,
            bearing: -17.6,
            antialias: true
        });

        const map = mapRef.current;

        // Add 3D Buildings on Style Load
        map.on('style.load', () => {
            const style = map.getStyle();
            if (!style) return;

            const layers = style.layers;
            let labelLayerId;

            if (layers) {
                for (let i = 0; i < layers.length; i++) {
                    const layer = layers[i];
                    if (layer.type === 'symbol' && layer.layout && (layer.layout as any)['text-field']) {
                        labelLayerId = layer.id;
                        break;
                    }
                }
            }

            map.addLayer(
                {
                    id: 'add-3d-buildings',
                    source: 'composite',
                    'source-layer': 'building',
                    filter: ['==', 'extrude', 'true'],
                    type: 'fill-extrusion',
                    minzoom: 14,
                    paint: {
                        'fill-extrusion-color': [
                            'case',
                            // 1st Priority: The building the user actually clicked on (Dark Maroon)
                            ['boolean', ['feature-state', 'clicked'], false],
                            theme.palette.primary.main,
                            // 2nd Priority: Any building that has a listing marker on it (Soft Rosy Pink)
                            ['boolean', ['feature-state', 'hasListing'], false],
                            '#CB9A9F',
                            // Default: Light Gray
                            '#e5e7eb'
                        ],
                        'fill-extrusion-height': [
                            'interpolate', ['linear'], ['zoom'], 15, 0, 15.05, ['get', 'height']
                        ],
                        'fill-extrusion-base': [
                            'interpolate', ['linear'], ['zoom'], 15, 0, 15.05, ['get', 'min_height']
                        ],
                        'fill-extrusion-opacity': 0.8
                    }
                },
                labelLayerId
            );

            setIsMapLoaded(true);
        });

        // Cleanup map properly
        return () => {
            setIsMapLoaded(false);
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, [theme.palette.primary.main]);

    // 3. Plot Markers & Dynamic Highlights
    useEffect(() => {
        if (!isMapLoaded || listings.length === 0 || !mapRef.current) return;

        const map = mapRef.current;

        // --- GROUP LISTINGS BY EXACT COORDINATES ---
        // Groups listings roughly within the same building to prevent overlapping pins
        const groupedData: Record<string, MapListing[]> = {};
        listings.forEach(listing => {
            if (!listing.latitude || !listing.longitude) return;
            const key = `${listing.latitude.toFixed(5)},${listing.longitude.toFixed(5)}`;
            if (!groupedData[key]) groupedData[key] = [];
            groupedData[key].push(listing);
        });
        const groupedListingsArray = Object.values(groupedData);

        // Fly to the center of the loaded data
        const centerLng = listings.reduce((sum, listing) => sum + listing.longitude, 0) / listings.length;
        const centerLat = listings.reduce((sum, listing) => sum + listing.latitude, 0) / listings.length;

        map.flyTo({
            center: [centerLng, centerLat],
            zoom: 11,
            essential: true
        });

        const updateHighlights = () => {
            if (map.getZoom() < 13.5) return;

            const bounds = map.getBounds();
            if (!bounds) return;

            // Apply highlights to buildings on screen
            const visibleGroups = groupedListingsArray.filter(group => {
                const first = group[0];
                return bounds.contains([first.longitude, first.latitude]);
            });
            const groupsToProcess = visibleGroups.slice(0, 300);

            groupsToProcess.forEach(group => {
                const first = group[0];
                const point = map.project([first.longitude, first.latitude]);
                const bbox: [mapboxgl.PointLike, mapboxgl.PointLike] = [
                    [point.x - 10, point.y - 10],
                    [point.x + 10, point.y + 10]
                ];

                const features = map.queryRenderedFeatures(bbox, { layers: ['add-3d-buildings'] });

                if (features.length > 0 && features[0].id !== undefined) {
                    map.setFeatureState(
                        { source: 'composite', sourceLayer: 'building', id: features[0].id },
                        { hasListing: true }
                    );
                }
            });
        };

        map.on('idle', updateHighlights);
        map.on('moveend', updateHighlights);

        const setBuildingClickedState = (featureId: string | number | undefined | null, isClicked: boolean) => {
            if (!map || featureId === undefined || featureId === null) return;
            map.setFeatureState(
                { source: 'composite', sourceLayer: 'building', id: featureId },
                { clicked: isClicked }
            );
        };

        // Clear existing markers and React roots safely
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];
        popupRootsRef.current.forEach(root => { setTimeout(() => root.unmount(), 0); });
        popupRootsRef.current = [];

        // Plot Grouped Markers
        groupedListingsArray.forEach((group) => {
            const firstListing = group[0];

            const el = document.createElement('div');
            el.className = 'custom-map-marker';
            el.style.backgroundColor = theme.palette.primary.main;
            el.style.color = '#ffffff';
            el.style.padding = '4px 10px';
            el.style.borderRadius = '14px';
            el.style.border = '2px solid #ffffff';
            el.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
            el.style.fontWeight = 'bold';
            el.style.fontSize = '12px';
            el.style.cursor = 'pointer';

            // Set text based on grouping
            if (group.length > 1) {
                el.innerText = `${group.length} Units`;
            } else {
                const shortPrice = firstListing.price >= 1000000
                    ? `$${Number((firstListing.price / 1000000).toFixed(2))}M`
                    : `$${(firstListing.price / 1000).toFixed(0)}k`;

                el.innerText = shortPrice;
            }

            // Render custom React Component into the Mapbox Popup
            const popupNode = document.createElement('div');
            const popupRoot = createRoot(popupNode);
            popupRoot.render(<PopupContent listings={group} theme={theme} />);
            popupRootsRef.current.push(popupRoot);

            const popup = new mapboxgl.Popup({ offset: 25, closeButton: false, maxWidth: '520px' })
                .setDOMContent(popupNode);

            popup.on('open', () => {
                const point = map.project([firstListing.longitude, firstListing.latitude]);
                const bbox: [mapboxgl.PointLike, mapboxgl.PointLike] = [
                    [point.x - 10, point.y - 10],
                    [point.x + 10, point.y + 10]
                ];

                const features = map.queryRenderedFeatures(bbox, { layers: ['add-3d-buildings'] });

                if (features.length > 0) {
                    setBuildingClickedState(selectedBuildingIdRef.current, false);

                    const featureId = features[0].id;
                    if (featureId !== undefined) {
                        selectedBuildingIdRef.current = featureId;
                        setBuildingClickedState(featureId, true);
                    }
                }
            });

            popup.on('close', () => {
                setBuildingClickedState(selectedBuildingIdRef.current, false);
                selectedBuildingIdRef.current = null;
            });

            if (map.getContainer()) {
                const marker = new mapboxgl.Marker(el)
                    .setLngLat([firstListing.longitude, firstListing.latitude])
                    .setPopup(popup)
                    .addTo(map);

                markersRef.current.push(marker);
            }
        });

        return () => {
            map.off('idle', updateHighlights);
            map.off('moveend', updateHighlights);

            markersRef.current.forEach(marker => marker.remove());
            markersRef.current = [];
            popupRootsRef.current.forEach(root => { setTimeout(() => root.unmount(), 0); });
            popupRootsRef.current = [];
        };

    }, [isMapLoaded, listings, theme.palette.primary.main]);

    // 4. Handle Fullscreen Toggle
    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            wrapperRef.current?.requestFullscreen().catch(() => undefined);
        } else {
            document.exitFullscreen();
        }
    };

    // Keep React state in sync with browser fullscreen state (e.g., if user presses 'Esc')
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    // Resize map when fullscreen is toggled so it fills the screen perfectly
    useEffect(() => {
        const timeout = setTimeout(() => {
            mapRef.current?.resize();
        }, 100); // Small delay to let the browser finish animating the layout
        return () => clearTimeout(timeout);
    }, [isFullscreen]);

    return (
        <div ref={wrapperRef} style={{ position: 'relative', width: '100%', height: '100%', backgroundColor: '#fff' }}>

            {/* Fullscreen Toggle Button */}
            {isMapLoaded && (
                <IconButton
                    onClick={toggleFullscreen}
                    sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        zIndex: 10,
                        backgroundColor: 'background.paper',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                        '&:hover': {
                            backgroundColor: 'grey.100',
                        }
                    }}
                    aria-label={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                >
                    {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
                </IconButton>
            )}

            {/* Loading Overlay */}
            {!isMapLoaded && (
                <Box
                    sx={{
                        position: 'absolute',
                        inset: 0,
                        zIndex: 10,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: 'rgba(255,255,255,0.7)',
                        backdropFilter: 'blur(2px)'
                    }}
                >
                    <CircularProgress color="primary" sx={{ mb: 2 }} />
                    <Typography variant="body2" fontWeight={600} color="text.secondary">
                        Loading map...
                    </Typography>
                </Box>
            )}

            <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />

            <style>
                {`
                .mapboxgl-popup-content {
                    border-radius: 12px;
                    padding: 12px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
                }
                .mapboxgl-popup-tip {
                    display: none;
                }
                .custom-map-marker:hover {
                    transform: scale(1.1);
                    transition: transform 0.2s ease-in-out;
                    z-index: 10;
                }
                `}
            </style>
        </div>
    );
}
