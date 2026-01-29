import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    Card,
    Typography,
    Button,
    Stack,
    CircularProgress,
    useTheme,
} from '@mui/material';
import {OpenInNew as OpenInNewIcon} from '@mui/icons-material';


const useLeaflet = () => {
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if ((window as any).L && (window as any).L.map) {
            setLoaded(true);
            return;
        }

        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);

        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.async = true;
        script.onload = () => {
            const checkInterval = setInterval(() => {
                if ((window as any).L && (window as any).L.map) {
                    clearInterval(checkInterval);
                    setLoaded(true);
                }
            }, 100);
        };
        document.body.appendChild(script);
    }, []);

    return loaded;
};



interface ListingLocationMapProps {
    lat: number;
    lng: number;
    address?: string;
}

export const ListingLocationMap: React.FC<ListingLocationMapProps> = ({
                                                                          lat,
                                                                          lng,
                                                                          address
                                                                      }) => {
    const isLeafletLoaded = useLeaflet();
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<any>(null);
    const markerRef = useRef<any>(null);
    const theme = useTheme();

    // 1. Initialize Map
    useEffect(() => {
        if (!isLeafletLoaded || !mapContainerRef.current) return;
        if (mapInstanceRef.current) return;

        const L = (window as any).L;

        const map = L.map(mapContainerRef.current, {
            scrollWheelZoom: false,
        }).setView([lat, lng], 18);

        mapInstanceRef.current = map;

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 22,
            attribution: '© OpenStreetMap'
        }).addTo(map);

        markerRef.current = L.marker([lat, lng]).addTo(map);

        if (address) {
            markerRef.current.bindPopup(address).openPopup();
        }

        setTimeout(() => map.invalidateSize(), 200);

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, [isLeafletLoaded]);

    // 2. Handle Prop Updates
    useEffect(() => {
        if (!mapInstanceRef.current || !markerRef.current) return;

        const map = mapInstanceRef.current;
        const marker = markerRef.current;

        map.setView([lat, lng], 15);
        marker.setLatLng([lat, lng]);

        if (address) {
            marker.bindPopup(address).openPopup();
        }
    }, [lat, lng, address]);

    const handleGetDirections = () => {
        const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
        window.open(url, '_blank');
    };

    if (!isLeafletLoaded) {
        return (
            <Card
                variant="outlined"
                sx={{
                    height: 300,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 2,
                    bgcolor: 'background.default',
                    color: 'text.secondary'
                }}
            >
                <CircularProgress size={24} />
                <Typography variant="body2">Loading Map...</Typography>
            </Card>
        );
    }

    return (
        <Card
            elevation={0}
            variant="outlined"
            sx={{
                width: '100%',
                overflow: 'hidden',
                borderRadius: theme.shape.borderRadius, // Modern rounded corners
                border: `1px solid ${theme.palette.divider}`
            }}
        >
            {/* Map Area */}
            <Box sx={{ position: 'relative', height: 520, width: '100%', bgcolor: 'grey.100' }}>
                <style>{`.leaflet-container { height: 100%; width: 100%; z-index: 0; }`}</style>
                <div ref={mapContainerRef} style={{ height: '100%', width: '100%' }} />
            </Box>

            {/* Footer */}
            <Box sx={{ p: theme.shape.padding, bgcolor: 'background.paper' }}>
                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    alignItems={{ xs: 'stretch', sm: 'center' }}
                    justifyContent="space-between"
                    spacing={2}
                >

                    {/* Action Button */}
                    <Button
                        variant="contained"
                        color="primary" // Uses theme primary color (usually blue)
                        size="small"
                        onClick={handleGetDirections}
                        endIcon={<OpenInNewIcon />}
                        sx={{
                            textTransform: 'none',
                            fontWeight: 600,
                            boxShadow: 'none',
                            whiteSpace: 'nowrap',
                            '&:hover': {
                                boxShadow: 'none'
                            }
                        }}
                    >
                        Get Directions
                    </Button>
                </Stack>
            </Box>
        </Card>
    );
};
