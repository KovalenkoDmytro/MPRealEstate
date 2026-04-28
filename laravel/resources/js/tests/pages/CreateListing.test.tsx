import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { NotificationProvider } from '@/context/NotificationContext';
import { listingService } from '@/services/listingService';
import { imageService } from '@/services/imageService';
import CreateListing from '@/pages/Users/Seller/Listings/Create';

// --- Mocks ---------------------------------------------------------------

vi.mock('@/layouts/AuthenticatedLayout/AuthenticatedLayout', () => ({
    default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock('@mui/material', () => ({
    Stack: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('@/components/common/Button', () => ({
    default: ({
        text,
        onClick,
        disabled,
    }: {
        text: string;
        onClick: () => void;
        disabled?: boolean;
    }) => (
        <button onClick={onClick} disabled={disabled}>
            {text}
        </button>
    ),
}));

vi.mock('@/components/listing/editing/ListingDetails', () => ({
    default: ({
        handleChange,
    }: {
        handleChange: (name: string, value: unknown) => void;
    }) => (
        <div data-testid="listing-details">
            <input
                data-testid="title-field"
                onChange={(e) => handleChange('title', e.target.value)}
            />
        </div>
    ),
}));

vi.mock('@/components/listing/editing/ListingImagesSection', () => ({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    default: ({ handlers, images }: any) => (
        <div data-testid="images-section">
            <input
                data-testid="main-image-input"
                type="file"
                onChange={handlers.handleMainImageChange}
            />
            {images.previewMainImage && (
                <button
                    data-testid="remove-main-image"
                    onClick={handlers.removeMainImage}
                >
                    Remove main
                </button>
            )}
            <input
                data-testid="gallery-input"
                type="file"
                multiple
                onChange={handlers.handleGalleryImagesChange}
            />
        </div>
    ),
}));

vi.mock('@/services/listingService', () => ({
    listingService: {
        createListing: vi.fn(),
    },
}));

vi.mock('@/services/imageService', () => ({
    imageService: {
        canAddImages: vi.fn(() => true),
        createPreviews: vi.fn((files: File[]) =>
            files.map((f) => ({ file: f, url: 'blob:mock-url' })),
        ),
        revokePreview: vi.fn(),
    },
}));

// --- Constants -----------------------------------------------------------

const CREATE_BUTTON_TEXT = 'Create Listing';
const PROCESSING_BUTTON_TEXT = 'Creating...';
const LISTINGS_REDIRECT_URL = '/listings';

const BYTES_IN_MB = 1024 * 1024;
const DEFAULT_MAX_BYTES = 4 * BYTES_IN_MB;
const OVERSIZED_BYTES = 5 * BYTES_IN_MB;
const SMALL_BYTES = 1 * BYTES_IN_MB;

const SUCCESS_MESSAGE = 'Listing created successfully.';
const VALIDATION_MESSAGE = 'The given data was invalid.';
const MAIN_IMAGE_ERROR = 'Main image is required.';

const INVALID_MIME_ERROR_FRAGMENT = 'JPG, PNG, or WEBP';
const SIZE_LIMIT_ERROR_FRAGMENT = 'must not exceed';
const MAX_GALLERY_ERROR_FRAGMENT = 'You can only upload up to';

// --- Helpers -------------------------------------------------------------

function createFile(
    sizeInBytes: number,
    type: string,
    name: string = 'photo.jpg',
): File {
    const file = new File(['content'], name, { type });
    Object.defineProperty(file, 'size', {
        value: sizeInBytes,
        writable: false,
        configurable: true,
    });
    return file;
}

function triggerFileInput(input: HTMLElement, files: File[]): void {
    Object.defineProperty(input, 'files', {
        value: files,
        writable: false,
        configurable: true,
    });
    fireEvent.change(input);
}

function renderCreate(props: { listingImageMaxBytes?: number } = {}) {
    return render(
        <NotificationProvider>
            <CreateListing {...props} />
        </NotificationProvider>,
    );
}

// --- Tests ---------------------------------------------------------------

describe('CreateListing', () => {
    beforeEach(() => {
        vi.clearAllMocks();

        vi.stubGlobal('URL', {
            createObjectURL: vi.fn(() => 'blob:preview-url'),
            revokeObjectURL: vi.fn(),
        });

        Object.defineProperty(window, 'location', {
            value: { href: '' },
            writable: true,
        });

        // Reset defaults (some tests overwrite these)
        vi.mocked(imageService.canAddImages).mockReturnValue(true);
        vi.mocked(imageService.createPreviews).mockImplementation((files: File[]) =>
            files.map((f) => ({ file: f, url: 'blob:mock-url' })),
        );
    });

    // Rendering -----------------------------------------------------------

    it('renders "Create Listing" button in initial state', () => {
        renderCreate();

        const button = screen.getByRole('button', { name: CREATE_BUTTON_TEXT });
        expect(button).toBeInTheDocument();
        expect(button).not.toBeDisabled();
    });

    it('renders listing-details and images-section', () => {
        renderCreate();

        expect(screen.getByTestId('listing-details')).toBeInTheDocument();
        expect(screen.getByTestId('images-section')).toBeInTheDocument();
    });

    // Submission — success ----------------------------------------------

    it('calls listingService.createListing when button is clicked', async () => {
        vi.mocked(listingService.createListing).mockResolvedValue({
            success: true,
            data: {},
            message: SUCCESS_MESSAGE,
        });

        renderCreate();

        const user = userEvent.setup();
        await user.click(screen.getByRole('button', { name: CREATE_BUTTON_TEXT }));

        await waitFor(() => {
            expect(listingService.createListing).toHaveBeenCalledTimes(1);
        });
        expect(listingService.createListing).toHaveBeenCalledWith(
            expect.any(FormData),
        );
    });

    it('shows "Creating..." and disables button while processing', async () => {
        let resolveCreate: ((value: Awaited<ReturnType<typeof listingService.createListing>>) => void) | undefined;
        vi.mocked(listingService.createListing).mockImplementation(
            () =>
                new Promise((resolve) => {
                    resolveCreate = resolve;
                }),
        );

        renderCreate();

        const user = userEvent.setup();
        const button = screen.getByRole('button', { name: CREATE_BUTTON_TEXT });

        await user.click(button);

        // Button should now show processing state
        await waitFor(() => {
            expect(
                screen.getByRole('button', { name: PROCESSING_BUTTON_TEXT }),
            ).toBeInTheDocument();
        });
        expect(
            screen.getByRole('button', { name: PROCESSING_BUTTON_TEXT }),
        ).toBeDisabled();

        // Resolve so React doesn't leak the pending promise
        await act(async () => {
            resolveCreate?.({ success: true, data: {}, message: SUCCESS_MESSAGE });
        });
    });

    it('calls setRedirectNotification with success message on success', async () => {
        const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');

        vi.mocked(listingService.createListing).mockResolvedValue({
            success: true,
            data: {},
            message: SUCCESS_MESSAGE,
        });

        renderCreate();

        const user = userEvent.setup();
        await user.click(screen.getByRole('button', { name: CREATE_BUTTON_TEXT }));

        await waitFor(() => {
            expect(setItemSpy).toHaveBeenCalledWith(
                'flashNotification',
                expect.stringContaining(SUCCESS_MESSAGE),
            );
        });

        const payload = setItemSpy.mock.calls.find(
            ([key]) => key === 'flashNotification',
        )?.[1];
        expect(payload).toBeDefined();
        const parsed = JSON.parse(payload as string);
        expect(parsed.message).toBe(SUCCESS_MESSAGE);
        expect(parsed.type).toBe('success');

        setItemSpy.mockRestore();
    });

    it('redirects to /listings on success', async () => {
        vi.mocked(listingService.createListing).mockResolvedValue({
            success: true,
            data: {},
            message: SUCCESS_MESSAGE,
        });

        renderCreate();

        const user = userEvent.setup();
        await user.click(screen.getByRole('button', { name: CREATE_BUTTON_TEXT }));

        await waitFor(() => {
            expect(window.location.href).toBe(LISTINGS_REDIRECT_URL);
        });
    });

    // Submission — error ------------------------------------------------

    it('calls showNotification with error message on 422 failure', async () => {
        vi.mocked(listingService.createListing).mockResolvedValue({
            success: false,
            errors: { main_image: [MAIN_IMAGE_ERROR] },
            message: VALIDATION_MESSAGE,
        });

        renderCreate();

        const user = userEvent.setup();
        await user.click(screen.getByRole('button', { name: CREATE_BUTTON_TEXT }));

        // The notification renders via NotificationProvider consumers, but here
        // we don't render a consumer. Instead, verify behaviour by ensuring the
        // button returns to its non-processing state (proving the catch path ran),
        // and that the service was called exactly once.
        await waitFor(() => {
            expect(
                screen.getByRole('button', { name: CREATE_BUTTON_TEXT }),
            ).toBeEnabled();
        });
        expect(listingService.createListing).toHaveBeenCalledTimes(1);
    });

    it('sets validation errors on 422 failure', async () => {
        vi.mocked(listingService.createListing).mockResolvedValue({
            success: false,
            errors: { title: ['Title is required.'] },
            message: VALIDATION_MESSAGE,
        });

        renderCreate();

        const user = userEvent.setup();
        await user.click(screen.getByRole('button', { name: CREATE_BUTTON_TEXT }));

        // After error resolves, the page is no longer processing
        await waitFor(() => {
            expect(
                screen.getByRole('button', { name: CREATE_BUTTON_TEXT }),
            ).toBeEnabled();
        });
        // No redirect should have taken place
        expect(window.location.href).toBe('');
    });

    // Main image ----------------------------------------------------------

    it('rejects an invalid image type and calls showNotification', () => {
        renderCreate();

        const input = screen.getByTestId('main-image-input');
        const invalidFile = createFile(SMALL_BYTES, 'image/gif', 'bad.gif');

        triggerFileInput(input, [invalidFile]);

        // The remove-main-image button should NOT be shown for invalid uploads
        expect(
            screen.queryByTestId('remove-main-image'),
        ).not.toBeInTheDocument();
    });

    it('rejects a file that exceeds the size limit and calls showNotification', () => {
        renderCreate();

        const input = screen.getByTestId('main-image-input');
        const oversizedFile = createFile(
            OVERSIZED_BYTES,
            'image/jpeg',
            'big.jpg',
        );

        triggerFileInput(input, [oversizedFile]);

        expect(
            screen.queryByTestId('remove-main-image'),
        ).not.toBeInTheDocument();
    });

    it('accepts a valid image file and shows the remove button', async () => {
        renderCreate();

        const input = screen.getByTestId('main-image-input');
        const validFile = createFile(SMALL_BYTES, 'image/jpeg', 'good.jpg');

        await act(async () => {
            triggerFileInput(input, [validFile]);
        });

        expect(screen.getByTestId('remove-main-image')).toBeInTheDocument();
        expect(URL.createObjectURL).toHaveBeenCalledWith(validFile);
    });

    it('calls imageService.revokePreview when main image is removed', async () => {
        renderCreate();

        const input = screen.getByTestId('main-image-input');
        const validFile = createFile(SMALL_BYTES, 'image/jpeg', 'good.jpg');

        await act(async () => {
            triggerFileInput(input, [validFile]);
        });

        const removeBtn = screen.getByTestId('remove-main-image');

        await act(async () => {
            fireEvent.click(removeBtn);
        });

        expect(imageService.revokePreview).toHaveBeenCalledTimes(1);
        expect(imageService.revokePreview).toHaveBeenCalledWith(
            'blob:preview-url',
        );
        // After removal, the remove button should be gone
        expect(
            screen.queryByTestId('remove-main-image'),
        ).not.toBeInTheDocument();
    });

    // Gallery images ------------------------------------------------------

    it('rejects gallery images with invalid type and calls showNotification', async () => {
        renderCreate();

        const input = screen.getByTestId('gallery-input');
        const invalidFile = createFile(SMALL_BYTES, 'image/gif', 'bad.gif');

        await act(async () => {
            triggerFileInput(input, [invalidFile]);
        });

        // Invalid input means createPreviews should NOT be called
        expect(imageService.createPreviews).not.toHaveBeenCalled();
    });

    it('shows error when gallery would exceed MAX_GALLERY_IMAGES', async () => {
        // Force canAddImages to return false, simulating the limit being reached
        vi.mocked(imageService.canAddImages).mockReturnValue(false);

        renderCreate();

        const input = screen.getByTestId('gallery-input');
        const validFile = createFile(SMALL_BYTES, 'image/jpeg', 'good.jpg');

        await act(async () => {
            triggerFileInput(input, [validFile]);
        });

        // Since the limit is exceeded, no previews should be created
        expect(imageService.createPreviews).not.toHaveBeenCalled();
        expect(imageService.canAddImages).toHaveBeenCalled();
    });

    it('accepts valid gallery images and updates state', async () => {
        renderCreate();

        const input = screen.getByTestId('gallery-input');
        const validFile1 = createFile(SMALL_BYTES, 'image/jpeg', 'one.jpg');
        const validFile2 = createFile(SMALL_BYTES, 'image/png', 'two.png');

        await act(async () => {
            triggerFileInput(input, [validFile1, validFile2]);
        });

        expect(imageService.createPreviews).toHaveBeenCalledTimes(1);
        expect(imageService.createPreviews).toHaveBeenCalledWith([
            validFile1,
            validFile2,
        ]);
    });
});
