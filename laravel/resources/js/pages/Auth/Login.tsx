import React, { FormEventHandler, useEffect, useState } from 'react';
import {
    Box,
    Button,
    Checkbox,
    FormControlLabel,
    IconButton,
    InputAdornment,
    TextField,
    Typography,
    Divider,
    Link as MuiLink,
    Stack,
} from '@mui/material';
import {
    Visibility,
    VisibilityOff,
    ArrowForward,
    Google,
    GitHub,
} from '@mui/icons-material';
import { Link, useForm, usePage } from '@inertiajs/react';
import { useNotification } from "@/context/NotificationContext";
import GuestLayout from '@/layouts/GuestLayout';
import IconLock from "@/icons/IconLock";
import IconEnvelope from "@/icons/IconEnvelope";

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
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700, color: '#374151' }}>
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
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: '#fff' } }}
                        />
                    </Box>

                    {/* Password */}
                    <Box>
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700, color: '#374151' }}>
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
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: '#fff' } }}
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

                    {/* Submit Button */}
                    <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        disabled={processing}
                        endIcon={<ArrowForward />}
                        sx={{
                            py: 1.5,
                            borderRadius: 3,
                            bgcolor: '#522B47',
                            fontWeight: 600,
                            textTransform: 'none',
                            '&:hover': { bgcolor: '#3d1f35' }
                        }}
                    >
                        Sign In
                    </Button>

                    <Divider sx={{ my: 1 }}><Typography variant="caption" color="text.secondary">Or continue with</Typography></Divider>

                    {/* Social Buttons */}
                    <Stack direction="row" spacing={2}>
                        <Button fullWidth variant="outlined" startIcon={<Google />} sx={{ borderRadius: 3, color: '#374151', borderColor: '#E5E7EB', textTransform: 'none' }}>
                            Google
                        </Button>
                        <Button fullWidth variant="outlined" startIcon={<GitHub />} sx={{ borderRadius: 3, color: '#374151', borderColor: '#E5E7EB', textTransform: 'none' }}>
                            GitHub
                        </Button>
                    </Stack>

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
