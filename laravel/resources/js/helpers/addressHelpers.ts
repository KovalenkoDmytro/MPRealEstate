export function extractAddressComponents(place: any) {
    const comps = place.addressComponents || [];
    const map: Record<string, string> = {};

    for (const c of comps) {
        const key = c.types[0];
        map[key] = c.longText || c.shortText || "";
    }

    return {
        street_number: map.street_number || "",
        street_name: map.route || "",
        city: map.locality || "",
        province: map.administrative_area_level_1 || "",
        postal_code: map.postal_code || "",
        country: map.country || "",
        latitude: place.location?.lat ?? null,
        longitude: place.location?.lng ?? null,
    };
}
