import axios from 'axios';
import { Head, Link } from '@inertiajs/react';
import { useState, FormEvent } from 'react';
import GuestLayout from '@/layouts/GuestLayout';
import { Box, Typography, Alert, Link as MuiLink, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';

export default function VerifyEmail() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const submit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        setError(null);

        try {
            const response = await axios.post(route('verification.resend'),
                { email },
                {
                    headers: {
                        'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                        'Accept': 'application/json',
                    },
                }
            );

            if (response.data.status === 'verification-link-sent') {
                setMessage('A new verification link has been sent to your email address.');
            } else {
                setMessage(response.data.message || 'Email sent successfully.');
            }
        } catch (err: any) {
            console.error(err);
            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError('Something went wrong. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <GuestLayout>
            <Head title="Email Verification" />

            <Box component="form" onSubmit={submit}>
                <Typography variant="h5" component="h1" gutterBottom>
                    Check Your Email
                </Typography>

                <Typography color="text.secondary" sx={{ mb: 2 }}>
                    Before continuing, please verify your email address by clicking the link we sent to your inbox.
                    If you didn’t receive it, enter your email below and click “Resend Verification Email.”
                </Typography>

                {/* Email input */}
                <TextField
                    label="Email Address"
                    type="email"
                    required
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    sx={{ mb: 3 }}
                />

                {/* Feedback messages */}
                {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <LoadingButton
                        type="submit"
                        loading={loading}
                        variant="contained"
                        disabled={!email}
                    >
                        Resend Verification Email
                    </LoadingButton>

                    <MuiLink
                        component={Link}
                        href={route('logout')}
                        method="post"
                        as="button"
                        underline="hover"
                        color="text.secondary"
                    >
                        Log Out
                    </MuiLink>
                </Box>
            </Box>
        </GuestLayout>
    );
}
