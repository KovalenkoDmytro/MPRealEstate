import { api } from "@/axios";
import {RegisterData} from "@/types/auth";
import {ApiResponseBase} from "@/services/dealService";


export const authService = {

    async register(formData: RegisterData): Promise<ApiResponseBase> {
        const { data } = await api.post(route("register"), {
            ...formData,
        });
        return data;
    },

};
