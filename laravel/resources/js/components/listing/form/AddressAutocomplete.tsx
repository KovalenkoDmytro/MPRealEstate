import React, { useEffect, useRef } from "react";
import {importLibrary } from "@googlemaps/js-api-loader";
interface Props {
    onSelect: (place: google.maps.places.Place) => void;
}

export default function AddressAutocomplete({ onSelect }: Props) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const autocompleteRef = useRef<google.maps.places.PlaceAutocompleteElement | null>(null);

    useEffect(() => {
        let mounted = true;

        async function initAutocomplete() {
            // Load the Places library dynamically
            await  importLibrary("places").catch(console.error);

            if (!mounted || !containerRef.current) return;

            // Create the actual autocomplete element
            const element = new google.maps.places.PlaceAutocompleteElement({
                requestedRegion: "ca", // restrict to Canada
            });

            autocompleteRef.current = element;

            // Append Google’s custom element to our container div
            containerRef.current.appendChild(element);

            // Listen for place selection
            element.addEventListener("gmp-select", async (event: any) => {
                const prediction = event?.placePrediction;
                if (!prediction) return;

                // Convert prediction → full place object
                const place = prediction.toPlace();

                // Fetch necessary fields
                await place.fetchFields({
                    fields: ["formattedAddress", "addressComponents", "location"],
                });

                onSelect(place);
            });
        }

        initAutocomplete();

        return () => {
            mounted = false;

            // Cleanup: remove autocomplete element
            if (autocompleteRef.current) {
                try {
                    autocompleteRef.current.remove();
                } catch {}
            }
        };
    }, []);

    return (
        <div className="w-full border rounded p-1" ref={containerRef}>
            {/* Google will inject an <gmp-place-autocomplete> element here */}
        </div>
    );
}
