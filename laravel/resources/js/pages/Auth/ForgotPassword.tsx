import { FormEventHandler } from 'react';
import {
    Box,
    TextField,
    Typography,
    InputAdornment,
    Link as MuiLink,
    Stack,
    Alert,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { Link, useForm } from '@inertiajs/react';
import GuestLayout from '@/layouts/GuestLayout';
import Button from "@/components/common/Button"; // Assuming you want to reuse your custom button
import IconEnvelope from "@/icons/IconEnvelope"; // Your custom icon
import theme from "@/theme";

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <GuestLayout
            headTitle="Forgot Password"
            title="Reset Password"
            subtitle="We'll send you a reset link"
        >


            {/* Top Navigation: Back to Sign In */}
            <Box sx={{ mb: 4 }}>
                <MuiLink
                    component={Link}
                    href={route('login')}
                    sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        color: theme.palette.text.primary,
                        fontWeight: 600,
                        textDecoration: 'none',
                        '&:hover': { color: theme.palette.primary.main }
                    }}
                >
                    <ArrowBack sx={{ fontSize: 18, mr: 1 }} />
                    Back to Sign In
                </MuiLink>
            </Box>

            {/* Success Message (if sent) */}
            {status && (
                <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
                    {status}
                </Alert>
            )}

            <form onSubmit={submit}>
                <Stack spacing={3}>
                    {/* Header Text */}
                    <Box>
                        <Typography variant="body1" sx={{ color: theme.palette.text.secondary, lineHeight: 1.6 }}>
                            Forgot your password? No problem. Just enter your email address
                            and we'll email you a password reset link.
                        </Typography>
                    </Box>

                    {/* Email Input */}
                    <Box>
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: theme.palette.text.primary }}>
                            Email Address
                        </Typography>
                        <TextField
                            id="email"
                            type="email"
                            fullWidth
                            placeholder="john.doe@example.com"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            autoFocus
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

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        version="primary"
                        text="Send Reset Link"
                        className="w-full" // Ensure your custom button supports full width
                        disabled={processing}
                    />

                    {/* Footer: Sign in instead */}
                    <Typography variant="body2" align="center" sx={{ color: theme.palette.text.secondary, mt: 2 }}>
                        Remember your password?{' '}
                        <MuiLink
                            component={Link}
                            href={route('login')}
                            sx={{ color: theme.palette.primary.main, fontWeight: 700, textDecoration: 'none' }}
                        >
                            Sign in instead
                        </MuiLink>
                    </Typography>
                </Stack>
            </form>
        </GuestLayout>
    );
}
