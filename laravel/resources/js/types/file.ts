import {BaseEntity} from "@/types/baseEntity";

/**
 * Represents a file uploaded to the system
 * Used for document storage in deals and other entities
 */
export interface DealFile extends BaseEntity {
    /** ID of the deal this file belongs to */
    deal_id: number;
    /** Name of the uploaded file */
    file_name: string;
    /** Path to the file in the storage system */
    file_path: string;
    /** File extension or MIME type */
    file_type: string;
    /** Name of the user who uploaded the file */
    author_name: string;
    /** Email of the user who uploaded the file */
    author_email: string;

    created_at: string;
    updated_at: string;
}

