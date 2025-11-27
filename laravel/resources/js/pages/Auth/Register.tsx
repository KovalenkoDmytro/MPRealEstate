import React, { useState, FormEvent, ChangeEvent } from 'react';
import {
    Box,
    TextField,
    Stack,
    Typography,
    Link as MuiLink,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
    Button,
    CircularProgress, SelectChangeEvent,
} from '@mui/material';
import { Head, Link } from '@inertiajs/react';
import GuestLayout from '@/layouts/GuestLayout';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNotification } from '@/context/NotificationContext';
import {authService} from "@/services/authService";
import {RegisterData, RegisterDataErrors} from "@/types/auth";
import {extractErrorMessage} from "@/helpers/errorHelpers";


export default function Register({ roles }: { roles: string[] }) {
    const [data, setData] = useState<RegisterData>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: '',
    });

    const [errors, setErrors] = useState<RegisterDataErrors>({});
    const [loading, setLoading] = useState(false);
    const { showNotification, setRedirectNotification } = useNotification();

    const handleInputChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>
    ) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
    };

    const submit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            const response = await authService.register(data);

            if (response.status === "success") {
                setRedirectNotification(response.message, response.status);
                window.location.href = route("verification.notice");
            } else {
                showNotification(response.message, "error");
            }

        } catch (err: any) {
            const errorMsg = extractErrorMessage(err.response);
            showNotification(errorMsg, "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <GuestLayout>
            <Head title="Register" />
            <ToastContainer position="top-center" autoClose={4000} theme="light" />

            <Box component="form" onSubmit={submit} sx={{ maxWidth: 450, mx: 'auto', mt: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom align="center">
                    Create an Account
                </Typography>

                <Stack spacing={2} sx={{ mt: 3 }}>
                    <TextField
                        name="name"
                        label="Full Name"
                        value={data.name}
                        onChange={handleInputChange}
                        required
                        error={!!errors.name}
                        helperText={errors.name}
                    />

                    <TextField
                        name="email"
                        label="Email Address"
                        type="email"
                        value={data.email}
                        onChange={handleInputChange}
                        required
                        error={!!errors.email}
                        helperText={errors.email}
                    />

                    <TextField
                        name="password"
                        label="Password"
                        type="password"
                        value={data.password || ''}
                        onChange={handleInputChange}
                        required
                        error={!!errors.password}
                        helperText={errors.password}
                    />

                    <TextField
                        name="password_confirmation"
                        label="Confirm Password"
                        type="password"
                        value={data.password_confirmation || ''}
                        onChange={handleInputChange}
                        required
                        error={!!errors.password_confirmation}
                        helperText={errors.password_confirmation}
                    />

                    <FormControl fullWidth error={!!errors.role}>
                        <InputLabel id="role-select-label">I am a...</InputLabel>
                        <Select
                            labelId="role-select-label"
                            name="role"
                            value={data.role}
                            label="I am a..."
                            onChange={handleInputChange}
                        >
                            {roles
                                .filter((role) => role !== "admin")
                                .map((role) => (
                                    <MenuItem key={role} value={role}>
                                        {role.charAt(0).toUpperCase() + role.slice(1)}
                                    </MenuItem>
                                ))}
                        </Select>
                        {errors.role && <FormHelperText>{errors.role}</FormHelperText>}
                    </FormControl>

                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            mt: 2,
                        }}
                    >
                        <MuiLink component={Link} href={route('login')} underline="hover">
                            Already registered?
                        </MuiLink>

                        <Box position="relative" display="inline-flex">
                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                disabled={loading}
                                sx={{ minWidth: 120 }}
                            >
                                Register
                            </Button>
                            {loading && (
                                <CircularProgress
                                    size={24}
                                    sx={{
                                        color: 'white',
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        mt: '-12px',
                                        ml: '-12px',
                                    }}
                                />
                            )}
                        </Box>
                    </Box>
                </Stack>
            </Box>
        </GuestLayout>
    );
}

