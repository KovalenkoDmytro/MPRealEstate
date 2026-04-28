import { Head, Link } from "@inertiajs/react";
import ApplicationLogo from "@/components/ApplicationLogo";
import {
    Box,
    Card,
    CardContent,
    Container,
    Divider,
    Grid,
    Stack,
    Typography,
} from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import HomeWorkOutlinedIcon from "@mui/icons-material/HomeWorkOutlined";
import GavelOutlinedIcon from "@mui/icons-material/GavelOutlined";
import theme from "@/theme";

type RoleCard = {
    icon: React.ReactNode;
    role: string;
    description: string;
    email: string;
};

const roles: RoleCard[] = [
    {
        icon: <HomeOutlinedIcon sx={{ color: theme.palette.primary.main, fontSize: 28 }} />,
        role: "Buyer",
        description:
            "Browse property listings, submit offers, and track your deal progress from offer to possession.",
        email: "buyer@example.com",
    },
    {
        icon: <HomeWorkOutlinedIcon sx={{ color: theme.palette.primary.main, fontSize: 28 }} />,
        role: "Seller",
        description:
            "Publish listings, manage incoming offers from buyers, and guide deals through to completion.",
        email: "seller@example.com",
    },
    {
        icon: <GavelOutlinedIcon sx={{ color: theme.palette.primary.main, fontSize: 28 }} />,
        role: "Lawyer",
        description:
            "Review assigned deals, collaborate with buyers and sellers, and assist with legal closing steps.",
        email: "lawyer@example.com",
    },
];

export default function Demo() {
    return (
        <>
            <Head title="Try the demo | EstateHub" />

            <Box
                sx={{
                    minHeight: "100dvh",
                    background: "linear-gradient(180deg, #F9FAFB 0%, #F3F4F6 100%)",
                    py: { xs: 3, md: 6 },
                }}
            >
                <Container maxWidth="lg">
                    <Box
                        sx={{
                            borderRadius: "28px",
                            overflow: "hidden",
                            border: `1px solid ${theme.palette.border.main}`,
                            bgcolor: theme.palette.background.white,
                            boxShadow: theme.shape.boxShadow,
                        }}
                    >
                        <Box
                            sx={{
                                px: { xs: 3, md: 5 },
                                py: { xs: 2.5, md: 3 },
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                borderBottom: `1px solid ${theme.palette.border.main}`,
                                background:
                                    "linear-gradient(90deg, rgba(87,42,77,0.06) 0%, rgba(208,118,105,0.08) 100%)",
                            }}
                        >
                            <Stack direction="row" spacing={1.5} alignItems="center">
                                <Box
                                    sx={{
                                        width: 42,
                                        height: 42,
                                        borderRadius: "12px",
                                        backgroundColor: theme.palette.primary.main,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <ApplicationLogo width={22} height={22} />
                                </Box>
                                <Box>
                                    <Typography variant="h6" fontWeight={800}>
                                        EstateHub
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Direct real estate marketplace
                                    </Typography>
                                </Box>
                            </Stack>

                            <Link
                                href={route("home")}
                                className="btn btn-outline"
                                style={{ textDecoration: "none" }}
                            >
                                Back to home
                            </Link>
                        </Box>

                        <Box sx={{ px: { xs: 3, md: 5 }, py: { xs: 4, md: 5 } }}>
                            <Stack spacing={1} mb={4}>
                                <Typography variant="h4" fontWeight={900}>
                                    Try the demo
                                </Typography>
                                <Typography color="text.secondary">
                                    Pick a role and explore the platform. Use the credentials below to log in.
                                </Typography>
                            </Stack>

                            <Grid container spacing={3}>
                                {roles.map((card) => (
                                    <Grid key={card.role} size={{ xs: 12, md: 4 }}>
                                        <Card
                                            variant="outlined"
                                            sx={{
                                                borderRadius: "18px",
                                                borderColor: theme.palette.border.main,
                                                height: "100%",
                                            }}
                                        >
                                            <CardContent sx={{ p: 3 }}>
                                                <Stack spacing={2}>
                                                    <Stack direction="row" spacing={1.2} alignItems="center">
                                                        {card.icon}
                                                        <Typography variant="h6" fontWeight={800}>
                                                            {card.role}
                                                        </Typography>
                                                    </Stack>

                                                    <Typography color="text.secondary" variant="body2">
                                                        {card.description}
                                                    </Typography>

                                                    <Divider />

                                                    <Stack spacing={1.5}>
                                                        <Stack spacing={0.5}>
                                                            <Typography variant="caption" color="text.secondary" fontWeight={600}>
                                                                Email
                                                            </Typography>
                                                            <Typography
                                                                variant="body2"
                                                                sx={{ fontFamily: "monospace" }}
                                                            >
                                                                {card.email}
                                                            </Typography>
                                                        </Stack>

                                                        <Stack spacing={0.5}>
                                                            <Typography variant="caption" color="text.secondary" fontWeight={600}>
                                                                Password
                                                            </Typography>
                                                            <Typography
                                                                variant="body2"
                                                                sx={{ fontFamily: "monospace" }}
                                                            >
                                                                password
                                                            </Typography>
                                                        </Stack>
                                                    </Stack>

                                                    <Link
                                                        href={route("login") + `?email=${encodeURIComponent(card.email)}&password=password`}
                                                        className="btn btn-primary"
                                                        style={{ textDecoration: "none", width: "100%", textAlign: "center" }}
                                                    >
                                                        Log in
                                                    </Link>
                                                </Stack>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>

                        <Box
                            sx={{
                                px: { xs: 3, md: 5 },
                                py: 2.5,
                                borderTop: `1px solid ${theme.palette.border.main}`,
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: { xs: "flex-start", md: "center" },
                                gap: 1,
                                flexDirection: { xs: "column", md: "row" },
                            }}
                        >
                            <Typography variant="body2" color="text.secondary">
                                © {new Date().getFullYear()} EstateHub. Built for direct buyer-seller transactions.
                            </Typography>
                            <Link
                                href={route("home")}
                                style={{ fontSize: "0.875rem", color: theme.palette.text.secondary, textDecoration: "none" }}
                            >
                                Back to home
                            </Link>
                        </Box>
                    </Box>
                </Container>
            </Box>
        </>
    );
}
