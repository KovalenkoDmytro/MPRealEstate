import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useTheme, Box, CircularProgress, Typography, IconButton } from '@mui/material';
import { Fullscreen, FullscreenExit } from '@mui/icons-material';

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

export default function PropertyMapSelector() {
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const markersRef = useRef<mapboxgl.Marker[]>([]);
    const selectedBuildingIdRef = useRef<string | number | null>(null);
    const theme = useTheme();

    const [isLoading, setIsLoading] = useState(true);
    const [mapData, setMapData] = useState<MapListing[]>([]);
    const [isMapLoaded, setIsMapLoaded] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    // 1. Fetch Lightweight Map Data
    useEffect(() => {
        let isMounted = true;

        const fetchMapData = async () => {
            try {
                setIsLoading(true);
                const response = await fetch('/api/map-listings');
                const data = await response.json();

                if (isMounted) {
                    setMapData(data);
                    setIsLoading(false);
                }
            } catch (error) {
                console.error("Failed to fetch map data:", error);
                if (isMounted) setIsLoading(false);
            }
        };

        fetchMapData();

        return () => { isMounted = false; };
    }, []);

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
            const layers = style?.layers;
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
        if (!isMapLoaded || isLoading || mapData.length === 0 || !mapRef.current) return;

        const map = mapRef.current;

        // Fly to the center of the loaded data
        const centerLng = mapData.reduce((sum, l) => sum + l.longitude, 0) / mapData.length;
        const centerLat = mapData.reduce((sum, l) => sum + l.latitude, 0) / mapData.length;

        map.flyTo({
            center: [centerLng, centerLat],
            zoom: 11,
            essential: true
        });

        const updateHighlights = () => {
            if (map.getZoom() < 13.5) return;

            const bounds = map.getBounds();
            if (!bounds) return;

            const visibleListings = mapData.filter(l => bounds.contains([l.longitude, l.latitude]));
            const listingsToProcess = visibleListings.slice(0, 300);

            listingsToProcess.forEach(listing => {
                const point = map.project([listing.longitude, listing.latitude]);
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

        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];

        mapData.forEach((listing) => {
            if (!listing.latitude || !listing.longitude) return;

            const shortPrice = `$${(listing.price / 1000).toFixed(0)}k`;
            const fullPrice = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(listing.price);
            const imageUrl = listing.main_image?.image_path || '/images/placeholder-house.jpg';
            const detailUrl = route("buyer.listings.show", listing.id);

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
            el.innerText = shortPrice;

            const popupContent = `
                <div style="padding: 4px; font-family: sans-serif; text-align: center; min-width: 160px;">
                    <img src="${imageUrl}" style="width: 100%; height: 120px; object-fit: cover; border-radius: 6px; margin-bottom: 8px;" alt="${listing.title}"/>
                    <h4 style="margin: 0 0 4px 0; font-size: 14px; font-weight: 700; color: #1a202c; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 160px;">
                        ${listing.title}
                    </h4>
                    <p style="margin: 0 0 10px 0; font-size: 15px; font-weight: 800; color: ${theme.palette.primary.main};">
                        ${fullPrice}
                    </p>
                    <a href="${detailUrl}" style="display: block; width: 100%; background: ${theme.palette.primary.main}; color: white; padding: 8px 0; border-radius: 6px; text-decoration: none; font-size: 12px; font-weight: 600; transition: opacity 0.2s;">
                        View Details
                    </a>
                </div>
            `;

            const popup = new mapboxgl.Popup({ offset: 25, closeButton: false }).setHTML(popupContent);

            popup.on('open', () => {
                const point = map.project([listing.longitude, listing.latitude]);
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

            const marker = new mapboxgl.Marker(el)
                .setLngLat([listing.longitude, listing.latitude])
                .setPopup(popup)
                .addTo(map);

            markersRef.current.push(marker);
        });

        return () => {
            map.off('idle', updateHighlights);
            map.off('moveend', updateHighlights);

            markersRef.current.forEach(marker => marker.remove());
            markersRef.current = [];
        };

    }, [mapData, isLoading, isMapLoaded, theme.palette.primary.main]);

    // 4. Handle Fullscreen Toggle
    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            wrapperRef.current?.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable fullscreen: ${err.message}`);
            });
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
            {isMapLoaded && !isLoading && (
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
            {(!isMapLoaded || isLoading) && (
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
