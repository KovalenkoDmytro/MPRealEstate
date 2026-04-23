export type FieldValue = string | number;

/**
 * Matches any character NOT allowed by sanitizeField.
 * Allowed: A-Z, a-z, 0-9, space, carriage return, newline.
 */
const restrictedCharsRegex = /[^A-Za-z0-9 \r\n]+/g;

/**
 * Sanitize a value:
 * - If it's a number → return the number as-is
 * - If it's a string → keep only allowed characters
 */
export default function sanitizeField(value: FieldValue): FieldValue {
    return typeof value === "string"
        ? value.replace(restrictedCharsRegex, "")
        : value;
}
