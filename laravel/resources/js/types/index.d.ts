export type User = {
    id: number;
    name: string;
    email: string;
    role: 'lawyer' | 'seller' | 'buyer';
    is_buyer_lawyer: boolean;
    is_seller_lawyer: boolean;
    lawyer_number: string;
}

export type Deal = {
    id: number;
    name: string;
    amount: number;
    current_step: string;
    data: string;
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
    files?: {
        id: number;
        file_name: string;
        file_path: string;
        author_name: string;
        author_email: string;
        created_at: string;
    }[] | null;
    users: Array<User>;
    condition_day: string | null;
    possession_day: string | null;
    security_deposit: string | null;
    is_condition_day_confirmed: boolean;
    is_possession_day_confirmed: boolean;

};

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
};
