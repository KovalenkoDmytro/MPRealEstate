
export interface RegisterData {
    name: string;
    email: string;
    password?: string;
    password_confirmation?: string;
    role: 'buyer' | 'seller' | 'lawyer' | '';
}

export interface RegisterDataErrors {
    name?: string;
    email?: string;
    password?: string;
    password_confirmation?: string;
    role?: string;
}

export interface ForgotPasswordData {
    email: string;
}


export interface ResetPasswordData {
    token: string;
    email: string;
    password?: string;
    password_confirmation?: string;
}
