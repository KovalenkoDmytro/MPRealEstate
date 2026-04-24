import { Head, Link } from "@inertiajs/react";
import ApplicationLogo from "@/components/ApplicationLogo";
import { User, UserRole } from "@/types";
import {
    Box,
    Card,
    CardContent,
    Chip,
    Container,
    Divider,
    Grid,
    Stack,
    Typography,
} from "@mui/material";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import HomeWorkOutlinedIcon from "@mui/icons-material/HomeWorkOutlined";
import HandshakeOutlinedIcon from "@mui/icons-material/HandshakeOutlined";
import SavingsOutlinedIcon from "@mui/icons-material/SavingsOutlined";
import GavelOutlinedIcon from "@mui/icons-material/GavelOutlined";
import MonitorOutlinedIcon from "@mui/icons-material/MonitorOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import theme from "@/theme";

type WelcomeStats = {
    users: number;
    listings: number;
    deals: number;
};

type WelcomeProps = {
    auth: {
        user: User | null;
    };
    canLogin: boolean;
    canRegister: boolean;
    stats?: Partial<WelcomeStats>;
};

type ActionLink = {
    label: string;
    href: string;
    variant: "primary" | "secondary" | "outline";
};

const actionLinkStyle = {
    width: "auto",
    textDecoration: "none",
} as const;

const statCardSx = {
    borderRadius: theme.shape.borderRadius,
    border: `1px solid ${theme.palette.border.main}`,
    boxShadow: theme.shape.boxShadow,
    height: "100%",
} as const;

function formatNumber(value: number): string {
    return new Intl.NumberFormat("en-US").format(value);
}

function getRoleAction(user: User): ActionLink {
    if (user.role === UserRole.Seller) {
        return {
            label: "Create listing",
            href: route("listings.create"),
            variant: "primary",
        };
    }

    if (user.role === UserRole.Buyer) {
        return {
            label: "Browse listings",
            href: route("listings.index"),
            variant: "primary",
        };
    }

    if (user.role === UserRole.Lawyer) {
        return {
            label: "Open deals",
            href: route("lawyer.deals.index"),
            variant: "primary",
        };
    }

    return {
        label: "Open listings",
        href: route("listings.index"),
        variant: "primary",
    };
}

function renderActionLink(action: ActionLink) {
    return (
        <Link
            href={action.href}
            className={`btn btn-${action.variant}`}
            style={actionLinkStyle}
        >
            {action.label}
        </Link>
    );
}

export default function Welcome({ auth, canLogin, canRegister, stats }: WelcomeProps) {
    const currentUser = auth?.user ?? null;

    const effectiveStats: WelcomeStats = {
        users: stats?.users ?? 0,
        listings: stats?.listings ?? 0,
        deals: stats?.deals ?? 0,
    };

    const rightPrimaryAction = currentUser ? getRoleAction(currentUser) : null;

    return (
        <>
            <Head title="EstateHub | Buy & Sell Directly" />

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

                            <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
                                {currentUser ? (
                                    renderActionLink({
                                        label: "Dashboard",
                                        href: route("dashboard"),
                                        variant: "secondary",
                                    })
                                ) : (
                                    <>
                                        {canLogin &&
                                            renderActionLink({
                                                label: "Log in",
                                                href: route("login"),
                                                variant: "outline",
                                            })}
                                        {canRegister &&
                                            renderActionLink({
                                                label: "Get started",
                                                href: route("register"),
                                                variant: "primary",
                                            })}
                                    </>
                                )}
                            </Stack>
                        </Box>

                        <Box sx={{ px: { xs: 3, md: 5 }, py: { xs: 4, md: 5 } }}>
                            <Grid container spacing={3.5} alignItems="stretch">
                                <Grid size={{ xs: 12, md: 7 }}>
                                    <Stack spacing={2.2}>
                                        <Stack direction="row" spacing={1} flexWrap="wrap">
                                            <Chip label="For sellers" color="primary" size="small" />
                                            <Chip label="For buyers" color="primary" variant="outlined" size="small" />
                                            <Chip label="Lawyer-assisted deal flow" variant="outlined" size="small" />
                                        </Stack>

                                        <Typography
                                            variant="h3"
                                            sx={{
                                                fontWeight: 900,
                                                fontSize: { xs: "2rem", md: "2.6rem" },
                                                lineHeight: 1.15,
                                                color: theme.palette.text.primary,
                                            }}
                                        >
                                            Sell directly, avoid oversized fees, and close online with confidence.
                                        </Typography>

                                        <Typography
                                            variant="h6"
                                            sx={{
                                                color: theme.palette.text.secondary,
                                                fontWeight: 500,
                                                maxWidth: "95%",
                                            }}
                                        >
                                            EstateHub helps sellers publish listings directly and helps buyers find the right property.
                                            Both sides can run the deal online with structured steps, clear communication, and lawyer
                                            involvement when needed.
                                        </Typography>

                                        <Stack spacing={1}>
                                            <Typography variant="body1" fontWeight={600}>
                                                Why users choose EstateHub:
                                            </Typography>
                                            <Typography variant="body1" color="text.secondary">
                                                • Direct marketplace model that reduces extra intermediary costs.
                                            </Typography>
                                            <Typography variant="body1" color="text.secondary">
                                                • Buyer and seller workflows designed for transparent progress.
                                            </Typography>
                                            <Typography variant="body1" color="text.secondary">
                                                • Online deal process with lawyer collaboration and document handling.
                                            </Typography>
                                        </Stack>

                                        <Stack direction="row" spacing={1.5} useFlexGap flexWrap="wrap" pt={1}>
                                            {currentUser ? (
                                                <>
                                                    {rightPrimaryAction && renderActionLink(rightPrimaryAction)}
                                                    {renderActionLink({
                                                        label: "Open dashboard",
                                                        href: route("dashboard"),
                                                        variant: "outline",
                                                    })}
                                                </>
                                            ) : (
                                                <>
                                                    {canRegister &&
                                                        renderActionLink({
                                                            label: "Create account",
                                                            href: route("register"),
                                                            variant: "primary",
                                                        })}
                                                    {canLogin &&
                                                        renderActionLink({
                                                            label: "I already have account",
                                                            href: route("login"),
                                                            variant: "outline",
                                                        })}
                                                </>
                                            )}
                                        </Stack>
                                    </Stack>
                                </Grid>

                                <Grid size={{ xs: 12, md: 5 }}>
                                    <Card sx={statCardSx}>
                                        <CardContent sx={{ p: 3 }}>
                                            <Stack spacing={2.2}>
                                                <Typography variant="h6" fontWeight={800}>
                                                    Marketplace activity
                                                </Typography>

                                                <Stack spacing={1.25}>
                                                    <Card variant="outlined" sx={{ borderRadius: "14px", borderColor: theme.palette.border.main }}>
                                                        <CardContent sx={{ py: 1.4, "&:last-child": { pb: 1.4 } }}>
                                                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                                                                <Stack direction="row" alignItems="center" spacing={1.2}>
                                                                    <GroupOutlinedIcon sx={{ color: theme.palette.primary.main }} />
                                                                    <Typography fontWeight={600}>Registered users</Typography>
                                                                </Stack>
                                                                <Typography variant="h6" fontWeight={800}>
                                                                    {formatNumber(effectiveStats.users)}
                                                                </Typography>
                                                            </Stack>
                                                        </CardContent>
                                                    </Card>

                                                    <Card variant="outlined" sx={{ borderRadius: "14px", borderColor: theme.palette.border.main }}>
                                                        <CardContent sx={{ py: 1.4, "&:last-child": { pb: 1.4 } }}>
                                                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                                                                <Stack direction="row" alignItems="center" spacing={1.2}>
                                                                    <HomeWorkOutlinedIcon sx={{ color: theme.palette.primary.main }} />
                                                                    <Typography fontWeight={600}>Property listings</Typography>
                                                                </Stack>
                                                                <Typography variant="h6" fontWeight={800}>
                                                                    {formatNumber(effectiveStats.listings)}
                                                                </Typography>
                                                            </Stack>
                                                        </CardContent>
                                                    </Card>

                                                    <Card variant="outlined" sx={{ borderRadius: "14px", borderColor: theme.palette.border.main }}>
                                                        <CardContent sx={{ py: 1.4, "&:last-child": { pb: 1.4 } }}>
                                                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                                                                <Stack direction="row" alignItems="center" spacing={1.2}>
                                                                    <HandshakeOutlinedIcon sx={{ color: theme.palette.primary.main }} />
                                                                    <Typography fontWeight={600}>Online deals</Typography>
                                                                </Stack>
                                                                <Typography variant="h6" fontWeight={800}>
                                                                    {formatNumber(effectiveStats.deals)}
                                                                </Typography>
                                                            </Stack>
                                                        </CardContent>
                                                    </Card>
                                                </Stack>

                                                <Divider />

                                                <Typography variant="body2" color="text.secondary">
                                                    Every deal can move through guided milestones and involve a lawyer to keep
                                                    both sides protected.
                                                </Typography>
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>

                            <Grid container spacing={2} sx={{ mt: { xs: 2, md: 3 } }}>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Card
                                        variant="outlined"
                                        sx={{
                                            borderRadius: "18px",
                                            borderColor: theme.palette.border.main,
                                            height: "100%",
                                        }}
                                    >
                                        <CardContent sx={{ p: 3 }}>
                                            <Stack spacing={1.2}>
                                                <Stack direction="row" spacing={1.2} alignItems="center">
                                                    <SavingsOutlinedIcon sx={{ color: theme.palette.primary.main }} />
                                                    <Typography variant="h6" fontWeight={800}>
                                                        For sellers
                                                    </Typography>
                                                </Stack>
                                                <Typography color="text.secondary">
                                                    Publish your home directly, manage incoming interest, and move to deal flow without
                                                    heavy traditional commission pressure.
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Keep control over timeline, pricing, and negotiation while staying transparent for buyers.
                                                </Typography>
                                                <Box pt={1}>
                                                    {currentUser?.role === UserRole.Seller
                                                        ? renderActionLink({
                                                              label: "Publish new listing",
                                                              href: route("listings.create"),
                                                              variant: "secondary",
                                                          })
                                                        : canRegister &&
                                                          renderActionLink({
                                                              label: "Start selling",
                                                              href: route("register"),
                                                              variant: "secondary",
                                                          })}
                                                </Box>
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                </Grid>

                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Card
                                        variant="outlined"
                                        sx={{
                                            borderRadius: "18px",
                                            borderColor: theme.palette.border.main,
                                            height: "100%",
                                        }}
                                    >
                                        <CardContent sx={{ p: 3 }}>
                                            <Stack spacing={1.2}>
                                                <Stack direction="row" spacing={1.2} alignItems="center">
                                                    <VerifiedUserOutlinedIcon sx={{ color: theme.palette.primary.main }} />
                                                    <Typography variant="h6" fontWeight={800}>
                                                        For buyers
                                                    </Typography>
                                                </Stack>
                                                <Typography color="text.secondary">
                                                    Discover active listings, communicate with owners directly, and track your offer-to-deal
                                                    progress online.
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Find your property faster with a clean process and structured legal collaboration when needed.
                                                </Typography>
                                                <Box pt={1}>
                                                    {currentUser?.role === UserRole.Buyer || currentUser?.role === UserRole.Admin
                                                        ? renderActionLink({
                                                              label: "Find listings",
                                                              href: route("listings.index"),
                                                              variant: "outline",
                                                          })
                                                        : canLogin &&
                                                          renderActionLink({
                                                              label: "Explore as buyer",
                                                              href: route("login"),
                                                              variant: "outline",
                                                          })}
                                                </Box>
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>

                            <Card
                                variant="outlined"
                                sx={{
                                    mt: 2,
                                    borderRadius: "18px",
                                    borderColor: theme.palette.border.main,
                                    background:
                                        "linear-gradient(95deg, rgba(87,42,77,0.04) 0%, rgba(44,35,62,0.04) 65%, rgba(208,118,105,0.08) 100%)",
                                }}
                            >
                                <CardContent sx={{ p: 3 }}>
                                    <Typography variant="h6" fontWeight={800} gutterBottom>
                                        Deal flow in 3 simple steps
                                    </Typography>

                                    <Grid container spacing={2}>
                                        <Grid size={{ xs: 12, md: 4 }}>
                                            <Stack spacing={1}>
                                                <MonitorOutlinedIcon sx={{ color: theme.palette.primary.main }} />
                                                <Typography fontWeight={700}>1. Publish or choose a listing</Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Seller adds the property, buyer finds a match and starts communication.
                                                </Typography>
                                            </Stack>
                                        </Grid>

                                        <Grid size={{ xs: 12, md: 4 }}>
                                            <Stack spacing={1}>
                                                <HandshakeOutlinedIcon sx={{ color: theme.palette.primary.main }} />
                                                <Typography fontWeight={700}>2. Run the deal online</Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Keep both sides synced with clear milestones and transparent status updates.
                                                </Typography>
                                            </Stack>
                                        </Grid>

                                        <Grid size={{ xs: 12, md: 4 }}>
                                            <Stack spacing={1}>
                                                <GavelOutlinedIcon sx={{ color: theme.palette.primary.main }} />
                                                <Typography fontWeight={700}>3. Involve a lawyer when required</Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Add legal support for confidence and proper document handling before completion.
                                                </Typography>
                                            </Stack>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
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
                            {!currentUser && canRegister && (
                                <Link
                                    href={route("register")}
                                    className="btn btn-primary"
                                    style={actionLinkStyle}
                                >
                                    Join now
                                </Link>
                            )}
                        </Box>
                    </Box>
                </Container>
            </Box>
        </>
    );
}
