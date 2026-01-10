import React, { FormEventHandler, useEffect, useState } from 'react';
import {
    Box,
    Checkbox,
    FormControlLabel,
    IconButton,
    InputAdornment,
    TextField,
    Typography,
    Link as MuiLink,
    Stack,
} from '@mui/material';
import {Visibility, VisibilityOff, ArrowForward,} from '@mui/icons-material';
import { Link, useForm, usePage } from '@inertiajs/react';
import Button from "@/components/common/Button";
import { useNotification } from "@/context/NotificationContext";
import GuestLayout from '@/layouts/GuestLayout';
import IconLock from "@/icons/IconLock";
import IconEnvelope from "@/icons/IconEnvelope";
import theme from "@/theme";

export default function Login({ canResetPassword }: { canResetPassword: boolean; }) {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const { showNotification } = useNotification();
    const { message }: any = usePage().props;

    useEffect(() => {
        if (message) showNotification(message, "success");
    }, [message]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), { onFinish: () => reset('password') });
    };

    return (
        <GuestLayout
            title="Welcome Back"
            subtitle="Sign in to your EstateHub account"
            headTitle='Log in'
        >

            <form onSubmit={submit}>
                <Stack spacing={3}>
                    {/* Email */}
                    <Box>
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: theme.palette.text.primary }}>
                            Email Address
                        </Typography>
                        <TextField
                            fullWidth
                            placeholder="john.doe@example.com"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            error={!!errors.email}
                            helperText={errors.email}
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <IconEnvelope />
                                        </InputAdornment>
                                    ),
                                }
                            }}
                        />
                    </Box>

                    {/* Password */}
                    <Box>
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: theme.palette.text.primary }}>
                            Password
                        </Typography>
                        <TextField
                            fullWidth
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter your password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            error={!!errors.password}
                            helperText={errors.password}
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <IconLock />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                },
                            }}

                        />
                    </Box>

                    {/* Options */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <FormControlLabel
                            control={<Checkbox size="small" checked={data.remember} onChange={(e) => setData('remember', e.target.checked)} sx={{ color: '#9CA3AF', '&.Mui-checked': { color: '#522B47' } }} />}
                            label={<Typography variant="body2" sx={{ color: '#6B7280' }}>Remember me</Typography>}
                        />
                        {canResetPassword && (
                            <MuiLink component={Link} href={route('password.request')} variant="body2" sx={{ color: '#522B47', fontWeight: 600, textDecoration: 'none' }}>
                                Forgot Password?
                            </MuiLink>
                        )}
                    </Box>

                    <Button
                        type="submit"
                        version="primary"
                        text="Sign In"
                        disabled={processing}
                        icon={<ArrowForward style={{ fontSize: '18px' }} />}
                    />

                    {/* Footer Link */}
                    <Typography variant="body2" align="center" sx={{ color: '#6B7280' }}>
                        Don't have an account?{' '}
                        <MuiLink component={Link} href={route('register')} sx={{ color: '#522B47', fontWeight: 700, textDecoration: 'none' }}>
                            Sign up for free
                        </MuiLink>
                    </Typography>
                </Stack>
            </form>

        </GuestLayout>
    );
}
