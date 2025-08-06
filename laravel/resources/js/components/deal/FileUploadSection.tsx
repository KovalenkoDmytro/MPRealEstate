import React, { useState } from "react";
import { useForm } from "@inertiajs/react";
import { filterFilesForUser } from "@/helpers/fileHelpers";
import { File, PropertyDetail } from "@/types";
import {
    Box,
    Typography,
    Button,
    LinearProgress,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Divider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import {useAuth} from "@/hooks/useAuth";

export default function FileUploadSection({ deal }: { deal: PropertyDetail;}) {
    // Initialize file upload form
    const user = useAuth();
    const { data, setData, post, progress } = useForm({ file: null as File | null });

    // Filter files based on user permissions
    const [uploadedFiles, setUploadedFiles] = useState(filterFilesForUser(deal.files || [], user, deal.users));
    const [isFileSelected, setIsFileSelected] = useState(false);

    /** Handle selecting file */
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setData("file", e.target.files[0]);
            setIsFileSelected(true);
        } else {
            setIsFileSelected(false);
        }
    };

    /** Handle upload submit */
    const handleUpload = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/deals/${deal.id}/files`, {
            onSuccess: (res) => {
                if (res.props.flash.success) {
                    setUploadedFiles([...uploadedFiles, res.props.flash.file]); // append new file
                    setIsFileSelected(false);
                }
            },
        });
    };

    /** Handle file delete */
    const handleDelete = async (fileId: number) => {
        await fetch(`/files/${fileId}`, {
            method: "DELETE",
            headers: {
                "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") || "",
                "Content-Type": "application/json",
            },
        });

        // Remove file from UI state
        setUploadedFiles(uploadedFiles.filter((file) => file.id !== fileId));
    };

    /** Handle file download */
    const downloadFile = async (fileId: number) => {
        try {
            const response = await fetch(`/files/${fileId}/download`, { method: "GET" });
            if (!response.ok) throw new Error("Failed to download file.");

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = fileId.toString(); // You could replace with actual file name if available
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } catch (error) {
            console.error("Download error:", error);
        }
    };

    return (
        <Box mt={4} p={3} border="1px solid #e0e0e0" borderRadius={2}>
            {/* Section Title */}
            <Typography variant="h6" fontWeight="bold" gutterBottom>
                📂 Upload Deal Files
            </Typography>

            {/* Upload Form */}
            <Box component="form" onSubmit={handleUpload} display="flex" flexDirection="column" gap={2}>
                <input type="file" onChange={handleFileChange} />

                {progress && <LinearProgress variant="determinate" value={progress.percentage || 0} />}

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={!isFileSelected}
                >
                    Upload File
                </Button>
            </Box>

            {/* Uploaded Files List */}
            {uploadedFiles.length > 0 && (
                <Box mt={3}>
                    <Typography variant="h6">📄 Deal Files</Typography>
                    <List>
                        {uploadedFiles.map((file: File, index) => (
                            <React.Fragment key={file.id}>
                                <ListItem>
                                    <ListItemText
                                        primary={
                                            <Button
                                                onClick={() => downloadFile(file.id)}
                                                startIcon={<DownloadIcon />}
                                                sx={{ textTransform: "none" }}
                                            >
                                                {file.file_name}
                                            </Button>
                                        }
                                        secondary={
                                            file.created_at
                                                ? `Uploaded on: ${new Date(file.created_at).toLocaleString()} by ${file.author_name} (${file.author_email})`
                                                : undefined
                                        }
                                    />
                                    <ListItemSecondaryAction>
                                        <IconButton edge="end" color="error" onClick={() => handleDelete(file.id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                                {index < uploadedFiles.length - 1 && <Divider />}
                            </React.Fragment>
                        ))}
                    </List>
                </Box>
            )}
        </Box>
    );
}
