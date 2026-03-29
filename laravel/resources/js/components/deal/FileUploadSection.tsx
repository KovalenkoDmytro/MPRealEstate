import React, { useState, useRef } from "react";
import {
    Box,
    Typography,
    Button,
    LinearProgress,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";

import { fileService } from "@/services/fileService";
import { filterFilesForUser } from "@/helpers/fileHelpers";
import { PropertyDetail, DealFile } from "@/types";
import { useAuth } from "@/hooks/useAuth";
import { useNotification } from "@/context/NotificationContext";

// Important: rename browser File to avoid type collisions
type UploadFile = globalThis.File;

export default function FileUploadSection({ deal }: { deal: PropertyDetail }) {
    const user = useAuth();
    const { showNotification } = useNotification();

    const [selectedFile, setSelectedFile] = useState<UploadFile | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState<number>(0);

    const [uploadedFiles, setUploadedFiles] = useState<DealFile[]>(
        filterFilesForUser(deal.files || [], user, deal.users)
    );

    const fileInputRef = useRef<HTMLInputElement>(null);

    // DELETE dialog state
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedForDeletion, setSelectedForDeletion] = useState<DealFile | null>(null);

    // Normalize backend response
    const extractUploadedFile = (response: any): DealFile | null => {
        return response?.file || response?.data?.file || null;
    };

    const resetFileInput = () => {
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    // File selection
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedFile(e.target.files?.[0] || null);
    };

    // Upload file
    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFile) return;

        setUploading(true);
        setUploadProgress(0);

        try {
            const response = await fileService.upload(deal.id, selectedFile);

            const uploadedFile = extractUploadedFile(response);
            if (uploadedFile) {
                setUploadedFiles((prev) => [...prev, uploadedFile]);
            }

            showNotification(response.message, response.status);

        } catch (err: any) {
            const message =
                err?.response?.data?.errors?.file?.[0] ||
                err?.response?.data?.message ||
                "Upload failed. Please try again.";

            showNotification(message, "error");
        } finally {
            resetFileInput();
            setSelectedFile(null);
            setUploading(false);
        }
    };

    // DELETE
    const requestDelete = (file: DealFile) => {
        setSelectedForDeletion(file);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!selectedForDeletion) return;

        try {
            await fileService.delete(selectedForDeletion.id);

            setUploadedFiles(prev => prev.filter(f => f.id !== selectedForDeletion.id));

            showNotification("File deleted successfully.", "success");
        } catch {
            showNotification("Delete failed. Try again.", "error");
        }

        setDeleteDialogOpen(false);
        setSelectedForDeletion(null);
    };

    // Download file
    const handleDownload = async (id: number, name: string) => {
        try {
            const blob = await fileService.download(id);
            const url = URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = name;
            link.click();

            URL.revokeObjectURL(url);
        } catch {
            showNotification("Download failed. Try again.", "error");
        }
    };

    return (
        <Box mt={4} p={3} border="1px solid #E0E0E0" borderRadius={2}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
                Upload Deal Files
            </Typography>

            {/* Upload Form */}
            <Box component="form" onSubmit={handleUpload} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} />

                {uploading && (
                    <LinearProgress variant="determinate" value={uploadProgress} />
                )}

                <Button
                    type="submit"
                    variant="contained"
                    disabled={!selectedFile || uploading}
                >
                    {uploading ? "Uploading..." : "Upload File"}
                </Button>
            </Box>

            {/* File List */}
            {uploadedFiles.length > 0 && (
                <Box mt={3}>
                    <Typography variant="h6" gutterBottom>
                        Deal Files
                    </Typography>

                    <List>
                        {uploadedFiles.map((file, index) => (
                            <React.Fragment key={file.id}>
                                <ListItem
                                    secondaryAction={
                                        <IconButton color="error" onClick={() => requestDelete(file)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    }
                                >
                                    <ListItemText
                                        primary={
                                            <Button
                                                onClick={() => handleDownload(file.id, file.file_name)}
                                                startIcon={<DownloadIcon />}
                                            >
                                                {file.file_name}
                                            </Button>
                                        }
                                        secondary={
                                            file.created_at &&
                                            `Uploaded: ${new Date(file.created_at).toLocaleString()} by ${file.author_name}`
                                        }
                                    />
                                </ListItem>

                                {index < uploadedFiles.length - 1 && <Divider />}
                            </React.Fragment>
                        ))}
                    </List>
                </Box>
            )}

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Delete File</DialogTitle>

                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete{" "}
                        <strong>{selectedForDeletion?.file_name}</strong>? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>

                    <Button onClick={confirmDelete} color="error" variant="contained">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
