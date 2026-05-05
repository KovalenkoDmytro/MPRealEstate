import { useState, useRef } from "react";
import {
    Card, CardContent, CardActions,
    Typography, LinearProgress,
    List, ListItem, ListItemText,
    IconButton, Divider, Stack, Box,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";

import { fileService } from "@/services/fileService";
import { filterFilesForUser } from "@/helpers/fileHelpers";
import { PropertyDetail, DealFile } from "@/types";
import { useAuth } from "@/hooks/useAuth";
import { useNotification } from "@/context/NotificationContext";
import Button from "@/components/common/Button";
import IconContainer from "@/components/common/IconContainer";
import IconUpload from "@/icons/IconUpload";
import IconDocument from "@/icons/IconDocument";
import ConfirmDialog from "@/components/ConfirmDialog";

type UploadFile = globalThis.File;

export default function FileUploadSection({ deal }: { deal: PropertyDetail }) {
    const theme = useTheme();
    const user = useAuth();
    const { showNotification } = useNotification();

    const [selectedFile, setSelectedFile] = useState<UploadFile | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [uploadedFiles, setUploadedFiles] = useState<DealFile[]>(
        filterFilesForUser(deal.files || [], user, deal.users)
    );

    const fileInputRef = useRef<HTMLInputElement>(null);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedForDeletion, setSelectedForDeletion] = useState<DealFile | null>(null);

    const cardSx = {
        mt: 3,
        p: theme.shape.padding,
        backgroundColor: theme.palette.background.white,
        borderRadius: theme.shape.borderRadius,
        border: `1px solid ${theme.palette.border.main}`,
    };

    const extractUploadedFile = (response: any): DealFile | null =>
        response?.file || response?.data?.file || null;

    const resetFileInput = () => {
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedFile(e.target.files?.[0] || null);
    };

    const handleUpload = async () => {
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

    const requestDelete = (file: DealFile) => {
        setSelectedForDeletion(file);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!selectedForDeletion) return;
        try {
            await fileService.delete(selectedForDeletion.id);
            setUploadedFiles((prev) => prev.filter((f) => f.id !== selectedForDeletion.id));
            showNotification("File deleted successfully.", "success");
        } catch {
            showNotification("Delete failed. Try again.", "error");
        }
        setDeleteDialogOpen(false);
        setSelectedForDeletion(null);
    };

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
        <Card variant="outlined" sx={cardSx}>
            <CardContent sx={{ p: 0 }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                    <IconContainer>
                        <IconUpload />
                    </IconContainer>
                    <Typography variant="h6">Deal Files</Typography>
                </Stack>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Upload documents related to this deal.
                </Typography>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        style={{
                            padding: "8px",
                            borderRadius: "8px",
                            border: `1px solid ${theme.palette.border.main}`,
                            color: theme.palette.text.secondary,
                            width: "100%",
                        }}
                    />

                    {selectedFile && (
                        <Typography variant="caption" color="text.secondary">
                            Selected: {selectedFile.name}
                        </Typography>
                    )}

                    {uploading && (
                        <LinearProgress variant="determinate" value={uploadProgress} sx={{ borderRadius: 1 }} />
                    )}
                </Box>

                {uploadedFiles.length > 0 && (
                    <Box mt={3}>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                            <IconContainer>
                                <IconDocument />
                            </IconContainer>
                            <Typography variant="h6">Uploaded Files</Typography>
                        </Stack>

                        <List disablePadding>
                            {uploadedFiles.map((file, index) => (
                                <>
                                    <ListItem
                                        key={file.id}
                                        disablePadding
                                        sx={{ py: 0.5 }}
                                        secondaryAction={
                                            <Stack direction="row" spacing={0.5}>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleDownload(file.id, file.file_name)}
                                                    title="Download"
                                                >
                                                    <DownloadIcon fontSize="small" />
                                                </IconButton>
                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    onClick={() => requestDelete(file)}
                                                    title="Delete"
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Stack>
                                        }
                                    >
                                        <ListItemText
                                            primary={
                                                <Typography variant="body2" fontWeight={500}>
                                                    {file.file_name}
                                                </Typography>
                                            }
                                            secondary={
                                                file.created_at &&
                                                `Uploaded: ${new Date(file.created_at).toLocaleString()} by ${file.author_name}`
                                            }
                                        />
                                    </ListItem>

                                    {index < uploadedFiles.length - 1 && <Divider />}
                                </>
                            ))}
                        </List>
                    </Box>
                )}
            </CardContent>

            <CardActions sx={{ p: 0, mt: 2 }}>
                <Button
                    text={uploading ? "Uploading..." : "Upload File"}
                    icon={<IconUpload />}
                    disabled={!selectedFile || uploading}
                    onClick={handleUpload}
                />
            </CardActions>

            <ConfirmDialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                title="Delete file?"
                description={
                    <Typography variant="body2" color="text.secondary">
                        Are you sure you want to delete{" "}
                        <strong>{selectedForDeletion?.file_name}</strong>? This cannot be undone.
                    </Typography>
                }
                confirmLabel="Delete"
                onConfirm={confirmDelete}
            />
        </Card>
    );
}
