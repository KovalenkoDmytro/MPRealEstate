import { describe, it, expect } from 'vitest';
import {
    ALLOWED_IMAGE_TYPES,
    FALLBACK_MAX_IMAGE_SIZE_BYTES,
    formatMaxImageSizeLabel,
    resolveMaxImageSizeBytes,
    validateImageFile,
    validateImageFiles,
} from '@/helpers/imageUploadValidationHelper';

/**
 * Byte-size constants — avoid magic numbers in assertions.
 */
const BYTES_IN_KB = 1024;
const BYTES_IN_MB = 1024 * 1024;
const ONE_MB = 1 * BYTES_IN_MB;
const TWO_AND_HALF_MB = 2.5 * BYTES_IN_MB;
const FOUR_MB = 4 * BYTES_IN_MB;
const FIVE_MB = 5 * BYTES_IN_MB;
const HALF_MB_IN_KB = 512 * BYTES_IN_KB;
const TEN_MB = 10 * BYTES_IN_MB;

const DEFAULT_SUBJECT = 'Gallery image';

/**
 * Create a File with a deterministic `size` property.
 *
 * jsdom's File constructor does not accept a third-argument `size` override,
 * so we force the size via Object.defineProperty after construction.
 */
function createFile(
    sizeInBytes: number,
    type: string,
    name: string = 'example.jpg',
): File {
    const file = new File(['placeholder'], name, { type });
    Object.defineProperty(file, 'size', {
        value: sizeInBytes,
        writable: false,
        configurable: true,
    });
    return file;
}

describe('resolveMaxImageSizeBytes', (): void => {
    it('returns the rawLimit when it is a positive finite number', (): void => {
        expect(resolveMaxImageSizeBytes(FIVE_MB)).toBe(FIVE_MB);
    });

    it('returns FALLBACK when rawLimit is undefined', (): void => {
        expect(resolveMaxImageSizeBytes(undefined)).toBe(FALLBACK_MAX_IMAGE_SIZE_BYTES);
    });

    it('returns FALLBACK when rawLimit is 0', (): void => {
        expect(resolveMaxImageSizeBytes(0)).toBe(FALLBACK_MAX_IMAGE_SIZE_BYTES);
    });

    it('returns FALLBACK when rawLimit is negative', (): void => {
        expect(resolveMaxImageSizeBytes(-1)).toBe(FALLBACK_MAX_IMAGE_SIZE_BYTES);
    });

    it('returns FALLBACK when rawLimit is Infinity', (): void => {
        expect(resolveMaxImageSizeBytes(Number.POSITIVE_INFINITY))
            .toBe(FALLBACK_MAX_IMAGE_SIZE_BYTES);
    });

    it('returns FALLBACK when rawLimit is NaN', (): void => {
        expect(resolveMaxImageSizeBytes(Number.NaN)).toBe(FALLBACK_MAX_IMAGE_SIZE_BYTES);
    });
});

describe('formatMaxImageSizeLabel', (): void => {
    it('formats 4MB correctly', (): void => {
        expect(formatMaxImageSizeLabel(FOUR_MB)).toBe('4MB');
    });

    it('formats 1MB correctly', (): void => {
        expect(formatMaxImageSizeLabel(ONE_MB)).toBe('1MB');
    });

    it('formats 2.5MB correctly', (): void => {
        expect(formatMaxImageSizeLabel(TWO_AND_HALF_MB)).toBe('2.5MB');
    });

    it('rounds sub-MB values (512KB) to two decimal places', (): void => {
        expect(formatMaxImageSizeLabel(HALF_MB_IN_KB)).toBe('0.5MB');
    });
});

describe('validateImageFile', (): void => {
    it('returns null for a valid JPEG within the size limit', (): void => {
        const file = createFile(ONE_MB, 'image/jpeg');
        expect(validateImageFile(file, FOUR_MB, DEFAULT_SUBJECT)).toBeNull();
    });

    it('returns null for a valid PNG within the size limit', (): void => {
        const file = createFile(ONE_MB, 'image/png', 'example.png');
        expect(validateImageFile(file, FOUR_MB, DEFAULT_SUBJECT)).toBeNull();
    });

    it('returns null for a valid WEBP within the size limit', (): void => {
        const file = createFile(ONE_MB, 'image/webp', 'example.webp');
        expect(validateImageFile(file, FOUR_MB, DEFAULT_SUBJECT)).toBeNull();
    });

    it('returns a type error message for an invalid MIME type (e.g. image/gif)', (): void => {
        const file = createFile(ONE_MB, 'image/gif', 'example.gif');
        expect(validateImageFile(file, FOUR_MB, DEFAULT_SUBJECT))
            .toBe(`${DEFAULT_SUBJECT} must be a JPG, PNG, or WEBP file.`);
    });

    it('returns a size error message when the file size exceeds the limit', (): void => {
        const file = createFile(FIVE_MB, 'image/jpeg');
        expect(validateImageFile(file, FOUR_MB, DEFAULT_SUBJECT))
            .toBe(`${DEFAULT_SUBJECT} must not exceed ${formatMaxImageSizeLabel(FOUR_MB)}.`);
    });

    it('returns null when the file size is exactly equal to the limit', (): void => {
        const file = createFile(FOUR_MB, 'image/jpeg');
        expect(validateImageFile(file, FOUR_MB, DEFAULT_SUBJECT)).toBeNull();
    });

    it('includes the subject name and size label in the size error message', (): void => {
        const subject = 'Profile photo';
        const file = createFile(TEN_MB, 'image/png', 'big.png');
        const error = validateImageFile(file, FOUR_MB, subject);

        expect(error).not.toBeNull();
        expect(error).toContain(subject);
        expect(error).toContain(formatMaxImageSizeLabel(FOUR_MB));
    });

    it('includes the subject name in the type error message', (): void => {
        const subject = 'Profile photo';
        const file = createFile(ONE_MB, 'image/gif', 'example.gif');
        const error = validateImageFile(file, FOUR_MB, subject);

        expect(error).not.toBeNull();
        expect(error).toContain(subject);
        expect(error).toContain('JPG, PNG, or WEBP');
    });
});

describe('validateImageFiles', (): void => {
    it('returns null for an empty array', (): void => {
        expect(validateImageFiles([], FOUR_MB, DEFAULT_SUBJECT)).toBeNull();
    });

    it('returns null for an array of valid files', (): void => {
        const files = [
            createFile(ONE_MB, 'image/jpeg'),
            createFile(ONE_MB, 'image/png', 'a.png'),
            createFile(ONE_MB, 'image/webp', 'b.webp'),
        ];

        expect(validateImageFiles(files, FOUR_MB, DEFAULT_SUBJECT)).toBeNull();
    });

    it('returns a type error when any file has an invalid MIME type', (): void => {
        const files = [
            createFile(ONE_MB, 'image/jpeg'),
            createFile(ONE_MB, 'image/gif', 'bad.gif'),
        ];

        expect(validateImageFiles(files, FOUR_MB, DEFAULT_SUBJECT))
            .toBe(`${DEFAULT_SUBJECT} must be a JPG, PNG, or WEBP file.`);
    });

    it('returns a size error when any file exceeds the size limit', (): void => {
        const files = [
            createFile(ONE_MB, 'image/jpeg'),
            createFile(FIVE_MB, 'image/png', 'big.png'),
        ];

        expect(validateImageFiles(files, FOUR_MB, DEFAULT_SUBJECT))
            .toBe(`${DEFAULT_SUBJECT} must not exceed ${formatMaxImageSizeLabel(FOUR_MB)}.`);
    });

    it('returns the type error (not the size error) when an invalid-type file is also oversize', (): void => {
        const files = [
            createFile(ONE_MB, 'image/jpeg'),
            createFile(TEN_MB, 'image/gif', 'big.gif'),
        ];

        expect(validateImageFiles(files, FOUR_MB, DEFAULT_SUBJECT))
            .toBe(`${DEFAULT_SUBJECT} must be a JPG, PNG, or WEBP file.`);
    });

    it('returns the size error when all types are valid but at least one file exceeds the limit', (): void => {
        const files = [
            createFile(ONE_MB, 'image/jpeg'),
            createFile(ONE_MB, 'image/png', 'a.png'),
            createFile(FIVE_MB, 'image/webp', 'big.webp'),
        ];

        expect(validateImageFiles(files, FOUR_MB, DEFAULT_SUBJECT))
            .toBe(`${DEFAULT_SUBJECT} must not exceed ${formatMaxImageSizeLabel(FOUR_MB)}.`);
    });
});

describe('ALLOWED_IMAGE_TYPES', (): void => {
    it('exposes the supported image MIME types', (): void => {
        expect(ALLOWED_IMAGE_TYPES.has('image/jpeg')).toBe(true);
        expect(ALLOWED_IMAGE_TYPES.has('image/jpg')).toBe(true);
        expect(ALLOWED_IMAGE_TYPES.has('image/png')).toBe(true);
        expect(ALLOWED_IMAGE_TYPES.has('image/webp')).toBe(true);
        expect(ALLOWED_IMAGE_TYPES.has('image/gif')).toBe(false);
    });
});
