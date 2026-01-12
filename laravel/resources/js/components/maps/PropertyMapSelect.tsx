import React, { useState, useEffect, useRef } from 'react';

// ============================================================================
// START OF REUSABLE COMPONENT (PropertyMapSelector.tsx)
// ============================================================================

// --- Icons (Inline SVGs to ensure stability & portability) ---
const Icons = {
    Search: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>,
    MapPin: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-4 10-6 10s-6-4-6-10a6 6 0 0 1 12 0Z"/><circle cx="12" cy="10" r="3"/></svg>,
    Loader: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>,
    Check: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
    Alert: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
};

// --- Types ---

export interface PropertyLocation {
    address: string;
    lat: number;
    lng: number;
}

export interface PropertyMapSelectorProps {
    /** Callback when user selects a location (triggers on map click or search success) */
    onPropertySelect: (location: PropertyLocation) => void;
}

// --- Helper Hook to Load Leaflet Dynamically ---
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

// --- Main Component ---

export const PropertyMapSelector: React.FC<PropertyMapSelectorProps> = ({
                                                                            onPropertySelect
                                                                        }) => {
    const isLeafletLoaded = useLeaflet();

    // State
    const [address, setAddress] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<{ msg: string; type: 'success' | 'error' | 'info' } | null>(null);

    // Refs
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<any>(null); // Leaflet Map
    const markerRef = useRef<any>(null);      // Leaflet Marker (Selection)

    // --- Map Initialization ---
    useEffect(() => {
        if (!isLeafletLoaded || !mapContainerRef.current) return;
        if (mapInstanceRef.current) return;

        const L = (window as any).L;
        if (!L || !L.map) return;

        // 1. Create Map
        const map = L.map(mapContainerRef.current).setView([51.505, -0.09], 13);
        mapInstanceRef.current = map;

        // 2. Add Tile Layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap'
        }).addTo(map);

        // 3. Click Listener
        map.on('click', (e: any) => {
            handleMapClick(e.latlng.lat, e.latlng.lng);
        });

        // 4. Force Resize
        setTimeout(() => { map.invalidateSize(); }, 200);

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, [isLeafletLoaded]);

    // --- Logic Functions ---

    const showStatus = (msg: string, type: 'success' | 'error' | 'info') => {
        setStatus({ msg, type });
        setTimeout(() => setStatus(null), 3000);
    };

    const updateMarkerAndNotify = (lat: number, lng: number, newAddress: string) => {
        const L = (window as any).L;
        const map = mapInstanceRef.current;
        if (!map || !L) return;

        if (markerRef.current) markerRef.current.remove();

        markerRef.current = L.marker([lat, lng]).addTo(map)
            .bindPopup(`<b>Selected</b><br>${newAddress}`)
            .openPopup();

        map.setView([lat, lng], 16);
        setAddress(newAddress);

        // Automatically pass data to parent component
        onPropertySelect({
            address: newAddress,
            lat: lat,
            lng: lng
        });
    };

    const handleMapClick = async (lat: number, lng: number) => {
        setIsLoading(true);
        setAddress("Loading address...");
        try {
            const response = await fetch(`https://photon.komoot.io/reverse?lon=${lng}&lat=${lat}`);
            const data = await response.json();

            let foundAddress = "Unknown Location";
            if (data.features && data.features.length > 0) {
                foundAddress = formatPhotonAddress(data.features[0].properties);
            }
            updateMarkerAndNotify(lat, lng, foundAddress);
        } catch (error) {
            console.error(error);
            showStatus("Failed to fetch address details", "error");
            setAddress("");
        } finally {
            setIsLoading(false);
        }
    };

    const handleManualSearch = async () => {
        if (!address.trim()) {
            showStatus("Please enter an address first", "error");
            return;
        }
        setIsLoading(true);
        try {
            const response = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(address)}`);
            const data = await response.json();

            if (data.features && data.features.length > 0) {
                const result = data.features[0];
                const [lng, lat] = result.geometry.coordinates;
                const formatted = formatPhotonAddress(result.properties);
                updateMarkerAndNotify(lat, lng, formatted);
                showStatus("Location found!", "success");
            } else {
                showStatus("Address not found", "error");
            }
        } catch (error) {
            console.error(error);
            showStatus("Search failed", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const formatPhotonAddress = (props: any) => {
        const parts = [];
        if (props.name) parts.push(props.name);

        const streetPart = [props.housenumber, props.street].filter(Boolean).join(" ");
        if (streetPart) parts.push(streetPart);

        if (props.city) parts.push(props.city);
        if (props.state) parts.push(props.state);
        if (props.country) parts.push(props.country);

        return parts.join(", ") || "Unknown Location";
    };

    if (!isLeafletLoaded) {
        return (
            <div className="flex items-center justify-center p-10 gap-2 text-slate-500">
                <Icons.Loader />
                <span>Loading Map Engine...</span>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[500px] w-full bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200">
            {/* Sidebar Controls */}
            <div className="p-6 bg-slate-50 border-r border-slate-200 flex flex-col gap-5 overflow-y-auto">
                <div>
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <span className="text-blue-600"><Icons.MapPin /></span>
                        Select Property
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                        Click map or search to select.
                    </p>
                </div>

                {/* Status Message */}
                {status && (
                    <div className={`p-3 rounded-lg text-sm flex items-center gap-2 ${
                        status.type === 'error' ? 'bg-red-50 text-red-600' :
                            status.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'
                    }`}>
                        <span>{status.type === 'error' ? <Icons.Alert /> : <Icons.Check />}</span>
                        {status.msg}
                    </div>
                )}

                {/* Address Input */}
                <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase text-slate-500">Address</label>
                    <div className="flex gap-2">
            <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Type address..."
                className="w-full p-3 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none h-24"
            />
                    </div>
                    <button
                        onClick={handleManualSearch}
                        disabled={isLoading}
                        className="w-full py-2 px-4 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                    >
                        {isLoading ? <Icons.Loader /> : <Icons.Search />}
                        <span>Find Address on Map</span>
                    </button>
                </div>
            </div>

            {/* Map Container */}
            <div className="lg:col-span-2 relative bg-slate-200 h-full min-h-[400px]">
                <style>{`.leaflet-container { height: 100%; width: 100%; }`}</style>
                <div ref={mapContainerRef} className="absolute inset-0 z-0 h-full w-full" />

                {!address && !isLoading && (
                    <div className="absolute top-4 right-4 z-[400] bg-white/90 backdrop-blur p-3 rounded-lg shadow-md text-sm text-slate-600 max-w-xs border border-white/50">
                        Click anywhere on the map to select address.
                    </div>
                )}
            </div>
        </div>
    );
};

// ============================================================================
// END OF REUSABLE COMPONENT
// ============================================================================


// --- APP COMPONENT (Usage Example) ---

export default function App() {
    const [selectedLocation, setSelectedLocation] = useState<PropertyLocation | null>(null);

    return (
        <div className="min-h-screen bg-slate-100 p-8 font-sans">
            <div className="max-w-5xl mx-auto space-y-8">

                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold text-slate-800">Address Selector</h1>
                    <p className="text-slate-500">Clicking the map immediately returns the address data below.</p>
                </div>

                {/* Using the extracted component */}
                <PropertyMapSelector
                    onPropertySelect={(location) => setSelectedLocation(location)}
                />

                {/* Displaying Return Data */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">Data returned to Parent Component:</h3>
                    {selectedLocation ? (
                        <pre className="bg-slate-50 p-4 rounded-lg text-sm text-slate-700 font-mono overflow-auto">
               {JSON.stringify(selectedLocation, null, 2)}
             </pre>
                    ) : (
                        <div className="text-slate-400 italic">No location selected yet.</div>
                    )}
                </div>

            </div>
        </div>
    );
}
