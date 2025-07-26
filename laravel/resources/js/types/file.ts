import {BaseEntity} from "@/types/baseEntity";

/**
 * Represents a file uploaded to the system
 * Used for document storage in deals and other entities
 */
export interface File extends BaseEntity {
    /** Name of the uploaded file */
    file_name: string;
    /** Path to the file in the storage system */
    file_path: string;
    /** Name of the user who uploaded the file */
    author_name: string;
    /** Email of the user who uploaded the file */
    author_email: string;
}
