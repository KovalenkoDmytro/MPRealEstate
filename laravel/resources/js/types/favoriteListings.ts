import type {RealEstateListing} from "@/types/realEstateListing";

export type FavoriteListings = {
    data: RealEstateListing[];
    links: { url: string | null; label: string; active: boolean }[];
    current_page: number;
    last_page: number;
    total: number
}
