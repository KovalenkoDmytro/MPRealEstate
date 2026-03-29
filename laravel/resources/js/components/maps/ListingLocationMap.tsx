import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import {
    Box,
    Card,
    Typography,
    Button,
    Stack,
    CircularProgress,
    useTheme,
    IconButton
} from '@mui/material';
import {
    OpenInNew as OpenInNewIcon,
    Fullscreen,
    FullscreenExit,
    LocationOn
} from '@mui/icons-material';
import { RealEstateListing } from '@/types'; // Import your listing type

interface ListingLocationMap {
    listing: RealEstateListing; // Accept the whole listing object
}

export const ListingLocationMap: React.FC<ListingLocationMap> = ({ listing }) => {
    // Extract what we need from the listing
    const lat = listing.latitude;
    const lng = listing.longitude;
    const address = `${listing.street_number} ${listing.street_name}, ${listing.city}`;
    const price = listing.price;

    const wrapperRef = useRef<HTMLDivElement>(null);
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const markerRef = useRef<mapboxgl.Marker | null>(null);
    const highlightedBuildingIdRef = useRef<string | number | null>(null);
    const theme = useTheme();

    const [isMapLoaded, setIsMapLoaded] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    // 1. Initialize Map
    useEffect(() => {
        mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || 'YOUR_MAPBOX_ACCESS_TOKEN';

        if (!mapContainerRef.current || mapRef.current) return;

        // Initialize Map
        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [lng, lat],
            zoom: 17, // Zoomed in closer for a single property
            pitch: 45,
            bearing: -17.6,
            antialias: true,
            scrollZoom: false,
        });

        mapRef.current = map;

        // Add navigation controls (zoom in/out buttons)
        map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'bottom-right');

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

            // Add 3D building layer
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
                            ['boolean', ['feature-state', 'highlighted'], false],
                            theme.palette.primary.main,
                            '#e5e7eb'
                        ],
                        'fill-extrusion-height': [
                            'interpolate', ['linear'], ['zoom'], 15, 0, 15.05, ['get', 'height']
                        ],
                        'fill-extrusion-base': [
                            'interpolate', ['linear'], ['zoom'], 15, 0, 15.05, ['get', 'min_height']
                        ],
                        'fill-extrusion-opacity': 0.85
                    }
                },
                labelLayerId
            );

            setIsMapLoaded(true);
        });

        return () => {
            setIsMapLoaded(false);
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, []); // Only run once on mount

    // 2. Draw Marker & Automatically Highlight Building
    useEffect(() => {
        if (!isMapLoaded || !mapRef.current) return;
        const map = mapRef.current;

        // Create Custom HTML Marker
        const el = document.createElement('div');
        el.className = 'custom-map-marker';
        el.style.backgroundColor = theme.palette.primary.main;
        el.style.color = '#ffffff';
        el.style.padding = price ? '4px 10px' : '6px';
        el.style.borderRadius = price ? '14px' : '50%';
        el.style.border = '2px solid #ffffff';
        el.style.boxShadow = '0 4px 10px rgba(0,0,0,0.3)';
        el.style.fontWeight = 'bold';
        el.style.fontSize = '12px';
        el.style.display = 'flex';
        el.style.alignItems = 'center';
        el.style.justifyContent = 'center';
        el.style.cursor = 'pointer';

        if (price) {
            const shortPrice = `$${(price / 1000).toFixed(0)}k`;
            el.innerText = shortPrice;
        } else {
            el.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`;
        }

        let popup: mapboxgl.Popup | undefined;
        if (address) {
            popup = new mapboxgl.Popup({ offset: 25, closeButton: false, className: 'single-property-popup' })
                .setHTML(`
                    <div style="padding: 4px; text-align: center;">
                        <p style="margin: 0; font-family: sans-serif; font-size: 13px; font-weight: 600; color: #1a202c;">
                            ${address}
                        </p>
                    </div>
                `);
        }

        if (markerRef.current) markerRef.current.remove();

        // Safety check to prevent crash if map is unmounting
        if (map.getContainer()) {
            markerRef.current = new mapboxgl.Marker(el)
                .setLngLat([lng, lat])
                .setPopup(popup || undefined)
                .addTo(map);

            if (popup) markerRef.current.togglePopup();
        }

        // Highlight Building Logic
        const highlightBuilding = () => {
            if (!mapRef.current) return;
            const point = map.project([lng, lat]);
            const bbox: [mapboxgl.PointLike, mapboxgl.PointLike] = [
                [point.x - 5, point.y - 5],
                [point.x + 5, point.y + 5]
            ];

            const features = map.queryRenderedFeatures(bbox, { layers: ['add-3d-buildings'] });

            if (features.length > 0 && features[0].id !== undefined) {
                if (highlightedBuildingIdRef.current !== null) {
                    map.setFeatureState(
                        { source: 'composite', sourceLayer: 'building', id: highlightedBuildingIdRef.current },
                        { highlighted: false }
                    );
                }

                const featureId = features[0].id;
                highlightedBuildingIdRef.current = featureId;

                map.setFeatureState(
                    { source: 'composite', sourceLayer: 'building', id: featureId },
                    { highlighted: true }
                );
            }
        };

        map.once('idle', highlightBuilding);

        return () => {
            if (markerRef.current) {
                markerRef.current.remove();
                markerRef.current = null;
            }
        };
    }, [lat, lng, address, price, isMapLoaded, theme.palette.primary.main]);

    // 3. React to prop coordinate changes
    useEffect(() => {
        if (!mapRef.current || !isMapLoaded) return;
        mapRef.current.flyTo({ center: [lng, lat], zoom: 17 });
    }, [lat, lng, isMapLoaded]);

    // 4. Handle Fullscreen
    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            wrapperRef.current?.requestFullscreen().catch(() => undefined);
        } else {
            document.exitFullscreen();
        }
    };

    useEffect(() => {
        const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    useEffect(() => {
        const timeout = setTimeout(() => {
            mapRef.current?.resize();
        }, 100);
        return () => clearTimeout(timeout);
    }, [isFullscreen]);

    const handleGetDirections = () => {
        const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
        window.open(url, '_blank');
    };

    return (
        <Card
            elevation={0}
            variant="outlined"
            ref={wrapperRef}
            sx={{
                width: '100%',
                overflow: 'hidden',
                borderRadius: isFullscreen ? 0 : (theme.shape as any).borderRadius || 2,
                border: isFullscreen ? 'none' : `1px solid ${theme.palette.divider}`,
                display: 'flex',
                flexDirection: 'column',
                height: isFullscreen ? '100vh' : 'auto',
                backgroundColor: 'background.paper'
            }}
        >
            <Box sx={{ position: 'relative', height: isFullscreen ? '100%' : 520, width: '100%', bgcolor: 'grey.100', flexGrow: 1 }}>

                <IconButton
                    onClick={toggleFullscreen}
                    sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        zIndex: 10,
                        backgroundColor: 'background.paper',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                        '&:hover': { backgroundColor: 'grey.100' }
                    }}
                >
                    {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
                </IconButton>

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
                            Loading Mapbox...
                        </Typography>
                    </Box>
                )}

                <div ref={mapContainerRef} style={{ height: '100%', width: '100%' }} />
            </Box>

            {!isFullscreen && (
                <Box sx={{ p: 2, bgcolor: 'background.paper', borderTop: `1px solid ${theme.palette.divider}` }}>
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        alignItems={{ xs: 'stretch', sm: 'center' }}
                        justifyContent="space-between"
                        spacing={2}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                            <LocationOn fontSize="small" />
                            <Typography variant="body2" fontWeight={500}>
                                {address || "Location unavailable"}
                            </Typography>
                        </Box>

                        <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            onClick={handleGetDirections}
                            endIcon={<OpenInNewIcon />}
                            sx={{
                                textTransform: 'none',
                                fontWeight: 600,
                                boxShadow: 'none',
                                whiteSpace: 'nowrap',
                                borderRadius: 2,
                                '&:hover': { boxShadow: 'none' }
                            }}
                        >
                            Get Directions
                        </Button>
                    </Stack>
                </Box>
            )}

            <style>
                {`
                .single-property-popup .mapboxgl-popup-content {
                    border-radius: 8px;
                    padding: 8px 12px;
                    box-shadow: 0 4px 16px rgba(0,0,0,0.15);
                }
                .single-property-popup .mapboxgl-popup-tip {
                    display: none;
                }
                .custom-map-marker {
                    transition: transform 0.2s ease-in-out;
                }
                .custom-map-marker:hover {
                    transform: scale(1.1);
                    z-index: 10;
                }
                `}
            </style>
        </Card>
    );
};
