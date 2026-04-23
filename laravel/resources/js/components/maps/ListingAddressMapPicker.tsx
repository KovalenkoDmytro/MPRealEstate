import { useEffect, useMemo, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Alert, Box, CircularProgress, Typography } from "@mui/material";
import theme from "@/theme";
import type { MapboxAddressData } from "@/components/listing/form/AddressAutocomplete";

type ListingAddressMapPickerProps = {
    latitude: number | null | undefined;
    longitude: number | null | undefined;
    fullAddress?: string;
    onSelect: (place: MapboxAddressData) => void;
};

const DEFAULT_CENTER: [number, number] = [-114.0719, 51.0447];
const BUILDING_LAYER_ID = "listing-address-picker-3d-buildings";
const BUILDING_SOURCE = "composite";
const BUILDING_SOURCE_LAYER = "building";
const BUILDING_SEARCH_RADIUS = 10;

type MapboxReverseFeature = {
    center?: [number, number];
    place_name?: string;
    text?: string;
    address?: string;
    context?: Array<{
        id?: string;
        text?: string;
    }>;
};

function readContextValue(context: MapboxReverseFeature["context"], prefix: string): string | undefined {
    return context?.find((item) => item.id?.startsWith(prefix))?.text;
}

function buildFallbackSelection(longitude: number, latitude: number): MapboxAddressData {
    return {
        fullAddress: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
        longitude,
        latitude,
        rawFeature: null,
    };
}

function isFiniteCoordinate(value: unknown): value is number {
    return typeof value === "number" && Number.isFinite(value);
}

function normalizeCoordinate(value: unknown): number | null {
    if (value === null || value === undefined || value === "") {
        return null;
    }

    const numeric = typeof value === "number" ? value : Number(String(value).trim());
    return Number.isFinite(numeric) ? numeric : null;
}

function hasValidLngLat(longitude: unknown, latitude: unknown): boolean {
    if (!isFiniteCoordinate(longitude) || !isFiniteCoordinate(latitude)) return false;

    return longitude >= -180 && longitude <= 180 && latitude >= -90 && latitude <= 90;
}

function toValidLngLat(longitude: unknown, latitude: unknown): [number, number] | null {
    const normalizedLongitude = normalizeCoordinate(longitude);
    const normalizedLatitude = normalizeCoordinate(latitude);

    if (normalizedLongitude === null || normalizedLatitude === null) {
        return null;
    }

    if (!hasValidLngLat(normalizedLongitude, normalizedLatitude)) {
        return null;
    }

    return [normalizedLongitude, normalizedLatitude];
}

async function reverseGeocode(longitude: number, latitude: number, token: string): Promise<MapboxAddressData> {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${token}&types=address&language=en&country=ca`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Unable to reverse geocode selected point.");
    }

    const payload = await response.json();
    const feature = payload?.features?.[0] as MapboxReverseFeature | undefined;

    if (!feature?.center) {
        return buildFallbackSelection(longitude, latitude);
    }

    const featureLongitude = feature.center[0] ?? longitude;
    const featureLatitude = feature.center[1] ?? latitude;
    const context = feature.context ?? [];

    return {
        fullAddress: feature.place_name || `${featureLatitude.toFixed(6)}, ${featureLongitude.toFixed(6)}`,
        longitude: featureLongitude,
        latitude: featureLatitude,
        streetNumber: feature.address,
        streetName: feature.text,
        city: readContextValue(context, "place") || readContextValue(context, "locality") || readContextValue(context, "district"),
        province: readContextValue(context, "region"),
        postalCode: readContextValue(context, "postcode"),
        country: readContextValue(context, "country"),
        rawFeature: feature,
    };
}

export default function ListingAddressMapPicker({
    latitude,
    longitude,
    fullAddress,
    onSelect,
}: ListingAddressMapPickerProps) {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const markerRef = useRef<mapboxgl.Marker | null>(null);
    const highlightedBuildingIdRef = useRef<string | number | null>(null);
    const onSelectRef = useRef(onSelect);

    const [isMapReady, setIsMapReady] = useState(false);
    const [isResolvingAddress, setIsResolvingAddress] = useState(false);
    const [mapError, setMapError] = useState<string | null>(null);

    const mapboxToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || "YOUR_MAPBOX_ACCESS_TOKEN";
    const hasValidToken = useMemo(() => mapboxToken !== "YOUR_MAPBOX_ACCESS_TOKEN", [mapboxToken]);

    useEffect(() => {
        onSelectRef.current = onSelect;
    }, [onSelect]);

    const updateMarker = (lng: number, lat: number) => {
        const map = mapRef.current;
        if (!map || !hasValidLngLat(lng, lat)) return;

        if (!markerRef.current) {
            const markerElement = document.createElement("div");
            markerElement.className = "listing-address-map-marker";

            markerRef.current = new mapboxgl.Marker({
                element: markerElement,
                anchor: "bottom",
            });
        }

        try {
            markerRef.current.setLngLat([lng, lat]);
            if (!markerRef.current.getElement().isConnected) {
                markerRef.current.addTo(map);
            }
        } catch {
            // Ignore transient map lifecycle errors (e.g. map being disposed during rerender).
        }
    };

    const clearHighlightedBuilding = () => {
        const map = mapRef.current;
        const selectedId = highlightedBuildingIdRef.current;

        if (!map || selectedId === null || selectedId === undefined) return;

        map.setFeatureState(
            { source: BUILDING_SOURCE, sourceLayer: BUILDING_SOURCE_LAYER, id: selectedId },
            { selected: false }
        );
    };

    const highlightBuildingAtPoint = (point: mapboxgl.Point) => {
        const map = mapRef.current;
        if (!map) return;

        const bbox: [mapboxgl.PointLike, mapboxgl.PointLike] = [
            [point.x - BUILDING_SEARCH_RADIUS, point.y - BUILDING_SEARCH_RADIUS],
            [point.x + BUILDING_SEARCH_RADIUS, point.y + BUILDING_SEARCH_RADIUS],
        ];

        let features: mapboxgl.MapboxGeoJSONFeature[] = [];

        try {
            features = map.queryRenderedFeatures(bbox, { layers: [BUILDING_LAYER_ID] });
        } catch {
            return;
        }

        const targetFeatureId = features[0]?.id;

        if (targetFeatureId === undefined || targetFeatureId === null) return;

        clearHighlightedBuilding();
        highlightedBuildingIdRef.current = targetFeatureId;

        try {
            map.setFeatureState(
                { source: BUILDING_SOURCE, sourceLayer: BUILDING_SOURCE_LAYER, id: targetFeatureId },
                { selected: true }
            );
        } catch {
            // Safe fallback when style/source is reloading.
        }
    };

    useEffect(() => {
        if (!mapContainerRef.current || mapRef.current) return;
        if (!hasValidToken) {
            setMapError("Mapbox token is not configured. Add VITE_MAPBOX_ACCESS_TOKEN to enable map correction.");
            return;
        }

        mapboxgl.accessToken = mapboxToken;
        const initialLngLat = toValidLngLat(longitude, latitude);
        const hasInitialCoordinates = initialLngLat !== null;
        const startCenter: [number, number] = initialLngLat ?? DEFAULT_CENTER;

        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: "mapbox://styles/mapbox/streets-v12",
            center: startCenter,
            zoom: hasInitialCoordinates ? 17 : 11.5,
            pitch: 45,
            bearing: -17.6,
            antialias: true,
        });

        map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "bottom-right");
        mapRef.current = map;

        const handleStyleLoad = () => {
            const style = map.getStyle();
            if (!style?.layers) return;

            const firstLabelLayerId = style.layers.find(
                (layer) => layer.type === "symbol" && layer.layout && (layer.layout as { "text-field"?: unknown })["text-field"]
            )?.id;

            if (!map.getLayer(BUILDING_LAYER_ID)) {
                map.addLayer(
                    {
                        id: BUILDING_LAYER_ID,
                        source: BUILDING_SOURCE,
                        "source-layer": BUILDING_SOURCE_LAYER,
                        filter: ["==", "extrude", "true"],
                        type: "fill-extrusion",
                        minzoom: 14,
                        paint: {
                            "fill-extrusion-color": [
                                "case",
                                ["boolean", ["feature-state", "selected"], false],
                                theme.palette.primary.main,
                                "#E5E7EB",
                            ],
                            "fill-extrusion-height": ["interpolate", ["linear"], ["zoom"], 15, 0, 15.05, ["get", "height"]],
                            "fill-extrusion-base": ["interpolate", ["linear"], ["zoom"], 15, 0, 15.05, ["get", "min_height"]],
                            "fill-extrusion-opacity": 0.85,
                        },
                    },
                    firstLabelLayerId
                );
            }

            setIsMapReady(true);
        };

        const handleMapClick = async (event?: mapboxgl.MapMouseEvent) => {
            const clickedLngLat = toValidLngLat(
                (event as { lngLat?: { lng?: unknown } } | undefined)?.lngLat?.lng,
                (event as { lngLat?: { lat?: unknown } } | undefined)?.lngLat?.lat
            );

            if (!clickedLngLat) {
                return;
            }

            const [clickedLongitude, clickedLatitude] = clickedLngLat;

            setMapError(null);
            setIsResolvingAddress(true);

            try {
                updateMarker(clickedLongitude, clickedLatitude);
                if (event?.point) {
                    highlightBuildingAtPoint(event.point);
                }
            } catch {
                // Prevent uncaught errors from bubbling to UI when map is in transition.
            }

            try {
                const selectedAddress = await reverseGeocode(clickedLongitude, clickedLatitude, mapboxToken);
                onSelectRef.current(selectedAddress);
            } catch {
                const fallbackSelection = buildFallbackSelection(clickedLongitude, clickedLatitude);
                onSelectRef.current(fallbackSelection);
                setMapError("Address details were not fully resolved. Coordinates were updated, please review street fields.");
            } finally {
                setIsResolvingAddress(false);
            }
        };

        map.on("style.load", handleStyleLoad);
        map.on("click", handleMapClick);

        return () => {
            map.off("style.load", handleStyleLoad);
            map.off("click", handleMapClick);
            clearHighlightedBuilding();

            markerRef.current?.remove();
            markerRef.current = null;

            map.remove();
            mapRef.current = null;
            setIsMapReady(false);
        };
    }, [hasValidToken, mapboxToken]);

    useEffect(() => {
        if (!isMapReady || !mapRef.current) return;
        const currentLngLat = toValidLngLat(longitude, latitude);
        if (!currentLngLat) return;
        const [currentLongitude, currentLatitude] = currentLngLat;

        const map = mapRef.current;
        updateMarker(currentLongitude, currentLatitude);

        let cancelled = false;

        const highlightWhenIdle = () => {
            if (cancelled) return;
            try {
                const projectedPoint = map.project([currentLongitude, currentLatitude]);
                highlightBuildingAtPoint(projectedPoint);
            } catch {
                // Ignore transient project errors while map is stabilizing.
            }
        };

        try {
            map.flyTo({ center: [currentLongitude, currentLatitude], zoom: 17, essential: true, speed: 1 });
            map.once("idle", highlightWhenIdle);
        } catch {
            // Ignore transient camera errors while map/style is still stabilizing.
        }

        return () => {
            cancelled = true;
            map.off("idle", highlightWhenIdle);
        };
    }, [isMapReady, latitude, longitude]);

    return (
        <Box>
            <Typography variant="subtitle2" gutterBottom>
                Property location on map
            </Typography>

            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1.5 }}>
                Click a building on the map to correct the address pin. We will update latitude/longitude and try to fill address fields.
            </Typography>

            {mapError && (
                <Alert severity="warning" sx={{ mb: 1.5 }}>
                    {mapError}
                </Alert>
            )}

            <Box
                sx={{
                    position: "relative",
                    width: "100%",
                    height: { xs: 300, md: 360 },
                    borderRadius: "12px",
                    overflow: "hidden",
                    border: `1px solid ${theme.palette.border.main}`,
                    backgroundColor: "#F3F4F6",
                }}
            >
                <div ref={mapContainerRef} style={{ width: "100%", height: "100%" }} />

                {!isMapReady && hasValidToken && (
                    <Box
                        sx={{
                            position: "absolute",
                            inset: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexDirection: "column",
                            gap: 1,
                            backgroundColor: "rgba(255,255,255,0.65)",
                            backdropFilter: "blur(2px)",
                        }}
                    >
                        <CircularProgress size={22} />
                        <Typography variant="body2" color="text.secondary">
                            Loading map...
                        </Typography>
                    </Box>
                )}

                {isResolvingAddress && (
                    <Box
                        sx={{
                            position: "absolute",
                            left: 12,
                            right: 12,
                            top: 12,
                            py: 0.8,
                            px: 1.2,
                            borderRadius: "10px",
                            backgroundColor: "rgba(44,35,62,0.78)",
                            color: "#fff",
                        }}
                    >
                        <Typography variant="caption">
                            Updating address from selected building...
                        </Typography>
                    </Box>
                )}
            </Box>

            {fullAddress && (
                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
                    Current location: {fullAddress}
                </Typography>
            )}

            <style>{`
                .listing-address-map-marker {
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    border: 2px solid #fff;
                    background: ${theme.palette.primary.main};
                    box-shadow: 0 2px 8px rgba(0,0,0,0.35);
                }
            `}</style>
        </Box>
    );
}
