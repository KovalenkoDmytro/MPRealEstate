/**
 * Base entity interface for domain models
 * Contains common properties for all database entities
 */
export interface BaseEntity {
    /** Unique identifier */
    readonly id: number;
    /** Creation timestamp in ISO8601 format */
    readonly created_at: string;
    /** Last update timestamp in ISO8601 format */
    readonly updated_at: string;
}
