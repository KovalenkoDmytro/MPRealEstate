export type ValidationErrors = Partial<{
    title: string[];
    description: string[];
    location: string[];
    main_image: string[];
    property_type: string[];
    year_built: string[];
}>;
