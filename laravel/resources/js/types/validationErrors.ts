export type ValidationErrors = Partial<{
    title: string[];
    description: string[];
    location: string[];
    main_image: string[];
    property_type: string[];
    year_built: string[];
    square_feet : string[];
    price : string[];
    property_taxes : string[];
    bedrooms : string[];
    bathrooms : string[];
}>;
