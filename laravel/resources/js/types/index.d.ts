export type User = {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    role: 'lawyer' | 'seller' | 'buyer' | 'admin';
    is_buyer_lawyer: boolean;
    is_seller_lawyer: boolean;
    lawyer_number: string | null;
    created_at: string;
    updated_at: string;
}

export type File = {
    id: number;
    file_name: string;
    file_path: string;
    author_name: string;
    author_email: string;
    created_at: string;
}

export type Deal = {
    id: number;
    name: string;
    amount: number;
    seller_message: string | null;
    is_confirmed: boolean;
    is_made: boolean;
    real_estate_listing: {
        id: number;
        title: string;
        description: string;
        location: string;
        price: number;
        bedrooms: number;
        bathrooms: number;
        square_feet: number;
        status: string;
        main_image?: { image_path: string };
        images?: { id: number; image_path: string }[];
    };
    files?: File[] | null;
    users: Array<User>;
    condition_day: string | null;
    possession_day: string | null;
    security_deposit: string | null;
    is_condition_day_confirmed: boolean;
    is_possession_day_confirmed: boolean;
    created_at: string;
    is_completed: boolean;
    updated_at: string;
    real_estate_listing_id: number | null;
};




export type Offer = {
    id: number;
    offer_price: number;
    message: string;
    status: 'pending' | 'accepted' | 'rejected';
    listing: Listing;
    buyer:User;
    created_at: string;
    updated_at: string;
}

export type Listing = {
    id: number;
    title: string;
    description: string;
    price: number;
    location: string;
    bedrooms: number;
    bathrooms: number;
    square_feet: number;
    deal: Deal;
    status: 'available' | 'sold' | 'pending';
    seller: User;
    main_image: { image_path: string } ;
    images: { id: number; image_path: string, is_main: number }[] | [];
    offers: Offer[];
    lot_size: number | null;
    property_type: string;
    year_built: number | null;
    has_garage: boolean;
    garage_spaces: number| null;
    has_basement: boolean;
    hoa_fees: number | null;
    property_taxes: number | null;
    price_reduced: boolean;
    created_at: string;
    keywords: string | null;
};




export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
};
