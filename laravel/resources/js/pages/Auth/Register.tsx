import React, { FormEventHandler } from 'react';
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
    SelectChangeEvent,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import GuestLayout from '@/layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react'; // 👈 Use this hook
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNotification } from '@/context/NotificationContext';
import { RegisterData } from "@/types/auth";

export default function Register() {
    // This hook from Inertia manages data, errors, processing, and the request
    const { data, setData, post, processing, errors } = useForm<RegisterData>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'buyer',
    });

    const { showNotification } = useNotification();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent) => {
        setData(e.target.name as keyof RegisterData, e.target.value);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        // This 'post' function will automatically follow the redirect from your backend
        post(route('register'), {
            onError: () => {
                showNotification('Please check the form for errors.', 'error');
            },
        });
    };

    return (
        <GuestLayout>
            <Head title="Register" />
            <ToastContainer position="top-center" autoClose={5000} theme="light" />
            <Box component="form" onSubmit={submit}>
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
                        value={data.password}
                        onChange={handleInputChange}
                        required
                        error={!!errors.password}
                        helperText={errors.password}
                    />
                    <TextField
                        name="password_confirmation"
                        label="Confirm Password"
                        type="password"
                        value={data.password_confirmation}
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
                            <MenuItem value="buyer">Buyer</MenuItem>
                            <MenuItem value="seller">Seller</MenuItem>
                            <MenuItem value="lawyer">Lawyer</MenuItem>
                        </Select>
                        {errors.role && <FormHelperText>{errors.role}</FormHelperText>}
                    </FormControl>

                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
                        <MuiLink component={Link} href={route('login')} underline="hover">
                            Already registered?
                        </MuiLink>
                        <LoadingButton
                            type="submit"
                            variant="contained"
                            size="large"
                            loading={processing}
                        >
                            Register
                        </LoadingButton>
                    </Box>
                </Stack>
            </Box>
        </GuestLayout>
    );
}
