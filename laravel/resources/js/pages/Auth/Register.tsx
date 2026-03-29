import { useState, FormEvent, ChangeEvent } from 'react';
import {
    Box,
    TextField,
    Stack,
    Typography,
    Link as MuiLink,
    MenuItem,
    InputAdornment,
    IconButton,
    Select,
    SelectChangeEvent,
    FormHelperText,
    CircularProgress
} from '@mui/material';
import {
    Visibility,
    VisibilityOff,
    ArrowForward,
} from '@mui/icons-material';
import { Link } from '@inertiajs/react';
import GuestLayout from '@/layouts/GuestLayout';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNotification } from '@/context/NotificationContext';
import { authService } from "@/services/authService";
import { RegisterData, RegisterDataErrors } from "@/types/auth";
import Button from "@/components/common/Button";
import IconEnvelope from "@/icons/IconEnvelope";
import theme from "@/theme";
import IconLock from "@/icons/IconLock";
import IconUser from "@/icons/IconUser";

export default function Register({ roles }: { roles: string[] }) {
    // State for form data
    const [data, setData] = useState<RegisterData>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: '',
    });

    // State for password visibility toggles
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [errors, setErrors] = useState<RegisterDataErrors>({});
    const [loading, setLoading] = useState(false);
    const { showNotification, setRedirectNotification } = useNotification();

    const handleInputChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>
    ) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
        // Clear specific error when user types
        if (errors[name as keyof RegisterDataErrors]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
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
            setErrors(err.response.data.errors);
        } finally {
            setLoading(false);
        }
    };

    return (
        <GuestLayout
            headTitle="Register"
            title="Create an account"
            subtitle="Join EstateHub and start selling"
        >

            <ToastContainer position="top-center" autoClose={4000} theme="light" />

            <form onSubmit={submit}>
                <Stack spacing={2.5}>
                    {/* Full Name */}
                    <Box>
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: theme.palette.text.primary }}>
                            Full Name
                        </Typography>
                        <TextField
                            fullWidth
                            name="name"
                            placeholder="John Doe"
                            value={data.name}
                            onChange={handleInputChange}
                            error={!!errors.name}
                            helperText={errors.name}
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <IconUser/>
                                        </InputAdornment>
                                    ),
                                }
                            }}
                        />
                    </Box>

                    {/* Email Address */}
                    <Box>
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: theme.palette.text.primary }}>
                            Email Address
                        </Typography>
                        <TextField
                            fullWidth
                            name="email"
                            type="email"
                            placeholder="john.doe@example.com"
                            value={data.email}
                            onChange={handleInputChange}
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
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Create a strong password"
                            value={data.password}
                            onChange={handleInputChange}
                            error={!!errors.password}
                            helperText={errors.password}
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <IconLock/>
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }
                            }}
                        />
                    </Box>

                    {/* Confirm Password */}
                    <Box>
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: theme.palette.text.primary }}>
                            Confirm Password
                        </Typography>
                        <TextField
                            fullWidth
                            name="password_confirmation"
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="Confirm your password"
                            value={data.password_confirmation}
                            onChange={handleInputChange}
                            error={!!errors.password_confirmation}
                            helperText={errors.password_confirmation}
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <IconLock />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }
                            }}
                        />
                    </Box>

                    {/* Role Selection */}
                    <Box>
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: theme.palette.text.primary }}>
                            I am a...
                        </Typography>
                        <Select
                            fullWidth
                            displayEmpty
                            name="role"
                            value={data.role}
                            onChange={handleInputChange}
                            error={!!errors.role}
                            renderValue={(selected) => {
                                if (!selected) {
                                    return <Typography color="text.secondary">Select your role</Typography>;
                                }
                                return selected.charAt(0).toUpperCase() + selected.slice(1);
                            }}
                            sx={{
                                '& .MuiSelect-select': {
                                    padding: '14px 16px', // Matches TextField padding
                                }
                            }}
                        >
                            {roles
                                .filter((role) => role !== "admin")
                                .map((role) => (
                                    <MenuItem key={role} value={role}>
                                        {role.charAt(0).toUpperCase() + role.slice(1)}
                                    </MenuItem>
                                ))}
                        </Select>
                        {errors.role && <FormHelperText error>{errors.role}</FormHelperText>}
                    </Box>

                    {/* Terms and Conditions */}
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mt: 1 }}>
                        I agree to the{' '}
                        <MuiLink href="#" sx={{ color: theme.palette.primary.main, fontWeight: 700, textDecoration: 'none' }}>
                            Terms & Conditions
                        </MuiLink>
                        {' '}and{' '}
                        <MuiLink href="#" sx={{ color: theme.palette.primary.main, fontWeight: 700, textDecoration: 'none' }}>
                            Privacy Policy
                        </MuiLink>
                    </Typography>

                    {/* Submit Button */}
                    <Box sx={{ position: 'relative' }}>
                        <Button
                            type="submit"
                            version="primary"
                            text="Create Account"
                            className="w-full"
                            disabled={loading}
                            icon={!loading ? <ArrowForward style={{ fontSize: '18px' }} /> : undefined}
                        />
                        {loading && (
                            <CircularProgress
                                size={24}
                                sx={{
                                    color: 'white',
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    marginTop: '-12px',
                                    marginLeft: '-12px',
                                }}
                            />
                        )}
                    </Box>

                    {/* Footer Link */}
                    <Typography variant="body2" align="center" sx={{ color: theme.palette.text.secondary }}>
                        Already have an account?{' '}
                        <MuiLink
                            component={Link}
                            href={route('login')}
                            sx={{ color: theme.palette.primary.main, fontWeight: 700, textDecoration: 'none' }}
                        >
                            Sign in
                        </MuiLink>
                    </Typography>
                </Stack>
            </form>
        </GuestLayout>
    );
}
