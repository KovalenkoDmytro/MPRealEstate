import { api } from "@/axios";
import {RegisterData} from "@/types/auth";


export const authService = {

    async register(formData: RegisterData) {
        try {
            const response = await api.post(route("register"), formData);


            return {
                success: true,
                message: response.data.message || "Registration successful!",
            };
        } catch (err: any) {

            if (err.response?.status === 422) {
                return {
                    success: false,
                    errors: err.response.data.errors ?? {},
                    message: err.response.data.message || "Please check the form for errors.",
                };
            }


            console.error("An unexpected error occurred during registration:", err);
            return {
                success: false,
                errors: {},
                message: err.response?.data?.message || "An unexpected error occurred. Please try again.",
            };
        }
    },
};
