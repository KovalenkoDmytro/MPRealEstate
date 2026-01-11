import axios from "axios";
import { useState, FormEvent, useEffect } from "react";
import GuestLayout from "@/layouts/GuestLayout";
import {
    Box,
    Typography,
    Alert,
    TextField,
    CircularProgress,
} from "@mui/material";
import Button from "@/components/common/Button";

export default function VerifyEmail() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [prefilledEmail, setPrefilledEmail] = useState<string>("");

    // Extract ?resendVerificationEmail=email@example.com from URL
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const emailParam = params.get("resendVerificationEmail");
        if (emailParam) {
            const decodedEmail = decodeURIComponent(emailParam);
            setPrefilledEmail(decodedEmail);
            setEmail(decodedEmail);
        }
    }, []);

    const submit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        setError(null);

        try {
            const response = await axios.post(
                route("verification.resend"),
                { email },
                {
                    headers: {
                        "X-CSRF-TOKEN":
                            (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)
                                ?.content || "",
                        Accept: "application/json",
                    },
                }
            );

            if (response.data.status === "verification-link-sent") {
                setMessage("A new verification link has been sent to your email address.");
            } else {
                setMessage(response.data.message || "Email sent successfully.");
            }
        } catch (err: any) {
            console.error(err);
            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError("Something went wrong. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <GuestLayout
            headTitle="Email Verification"
            title="Verify Your Email Address"
            subtitle="Please verify your email to continue"
        >
            <Box component="form" onSubmit={submit} sx={{ maxWidth: 450, mx: "auto", mt: 4 }}>
                {!prefilledEmail && (
                    <>
                        <Typography variant="h5" component="h1" gutterBottom>
                            Check Your Email
                        </Typography>

                        <Typography color="text.secondary" sx={{ mb: 2 }}>
                            Before continuing, please verify your email address by clicking the link we sent to
                            your inbox. If you didn’t receive it, enter your email below and click
                            “Resend Verification Email.”
                        </Typography>
                    </>
                )}

                {/* Email input */}
                <TextField
                    label="Email Address"
                    type="email"
                    required
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    sx={{ mb: 3 }}
                    disabled={loading}
                />

                {/* Feedback messages */}
                {message && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        {message}
                    </Alert>
                )}
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Box position="relative" display="inline-flex">

                        <Button
                            type="submit"
                            version="primary"
                            text={loading ? "Sending..." : "Resend Verification Email"}
                            disabled={!email || loading}
                        />

                        {/* Loading Overlay */}
                        {loading && (
                            <CircularProgress
                                size={24}
                                sx={{
                                    color: "white", // Ensure this contrasts with your primary button color
                                    position: "absolute",
                                    top: "50%",
                                    left: "50%",
                                    marginTop: "-12px",
                                    marginLeft: "-12px",
                                }}
                            />
                        )}
                    </Box>
                </Box>
            </Box>
        </GuestLayout>
    );
}
