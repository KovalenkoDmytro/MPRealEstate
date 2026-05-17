
export interface RegisterData {
    name: string;
    phone_number: string;
    email: string;
    password?: string;
    password_confirmation?: string;
    role: 'buyer' | 'seller' | 'lawyer' | '';
}

export interface RegisterDataErrors {
    name?: string;
    phone_number?: string;
    email?: string;
    password?: string;
    password_confirmation?: string;
    role?: string;
}
