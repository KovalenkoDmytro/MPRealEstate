import { api } from "@/axios";
import {File} from "@/types";

export const fileService = {

    async upload(dealId: number, file: File) {

        const formData = new FormData();
        formData.append("file", file);

        const response = await api.post(`/deals/${dealId}/files`, formData, {
            headers: {
                "Accept": "application/json",
                "Content-Type": "multipart/form-data",
            },
        });

        return response.data;
    },


    async delete(fileId: number) {
        const response = await api.delete(`/deals/files/${fileId}`);

        return response.data;
    },


    async download(fileId: number) {
        const response = await api.get(`/deals/files/${fileId}/download`, {
            responseType: "blob",
        });

        return response.data;
    },
};
