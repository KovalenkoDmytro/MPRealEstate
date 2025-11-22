export type FieldValue = string | number;

/**
 * Matches any character NOT allowed by sanitizeField:
 * - allowed: A–Z, a–z, 0–9, space, carriage return, newline
 */
const regex = /[^A-Za-z0-9 \r\n]+/g;

/**
 * Sanitize a value:
 * - If it's a number → return the number as-is
 * - If it's a string → return only letters, digits, spaces, and newlines
 */
export default function sanitizeField(value: FieldValue): FieldValue {
    return typeof value === "string"
        ? value.replace(regex, "")
        : value;
}
