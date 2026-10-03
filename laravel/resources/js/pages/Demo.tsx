import { Head, Link } from '@inertiajs/react';
import { Box, Button, Container, Stack, Typography } from '@mui/material';
import { ArrowBackRounded, ArrowForwardRounded, HomeOutlined, HomeWorkOutlined, GavelOutlined } from '@mui/icons-material';
import ApplicationLogo from '@/components/ApplicationLogo';
import { neutral, primary, accent, info, radius } from '@/design/tokens';
import theme from '@/theme';

const editorialFont = 'Georgia, "Times New Roman", serif';
const line = 'rgba(255,255,255,0.2)';
const roles = [
    { number: '01', role: 'Buyer', icon: <HomeOutlined />, tone: primary, title: 'Find your next home.', description: 'See the marketplace from a buyer’s perspective.', features: ['Browse properties and save favorites', 'Arrange viewings and send offers', 'Follow your deal through to possession'], email: 'buyer@example.com' },
    { number: '02', role: 'Seller', icon: <HomeWorkOutlined />, tone: accent, title: 'Make your next move.', description: 'Manage your property from listing to agreement.', features: ['Publish and manage your listings', 'Review viewing requests and offers', 'Keep track of your active deals'], email: 'seller@example.com' },
    { number: '03', role: 'Lawyer', icon: <GavelOutlined />, tone: info, title: 'Bring it all together.', description: 'Explore the legal side of the deal workspace.', features: ['Review the deals assigned to you', 'Collaborate with buyers and sellers', 'Work through the closing milestones'], email: 'lawyer@example.com' },
];

export default function Demo() {
    return (
        <>
            <Head title="Explore the demo | EstateHub" />
            <Box sx={{ minHeight: '100dvh', background: theme.palette.background.gradient, backgroundAttachment: 'fixed', color: neutral[0] }}>
                <Container maxWidth={false} sx={{ maxWidth: 1440, px: { xs: 2.5, sm: 4, md: 6 } }}>
                    <Box component="header" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, py: { xs: 2.5, md: 3.5 }, borderBottom: `1px solid ${line}` }}>
                        <Link href={route('home')} style={{ color: 'inherit', textDecoration: 'none' }}>
                            <Stack direction="row" spacing={1.25} alignItems="center"><Box sx={{ display: 'flex', p: 1, bgcolor: primary[600], borderRadius: radius.sm }}><ApplicationLogo width={24} height={24} /></Box><Typography sx={{ fontSize: '1.2rem', fontWeight: 700, letterSpacing: '-0.03em' }}>EstateHub</Typography></Stack>
                        </Link>
                        <Button LinkComponent={Link} href={route('home')} startIcon={<ArrowBackRounded sx={{ fontSize: 18 }} />} sx={{ color: neutral[0], px: 0, fontWeight: 500, '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' } }}>Back to home</Button>
                    </Box>

                    <Box component="main">
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: '1.3fr 1fr' }, gap: 3, alignItems: 'end', pt: { xs: 5, md: 7 }, pb: { xs: 4, md: 5 } }}>
                            <Box>
                                <Typography sx={{ color: neutral[300], fontSize: '0.72rem', letterSpacing: '0.17em', fontWeight: 600, mb: 2.5 }}>INSIDE ESTATEHUB</Typography>
                                <Typography component="h1" sx={{ fontFamily: editorialFont, fontWeight: 400, fontSize: { xs: '2.8rem', sm: '3.5rem', lg: '4.4rem' }, lineHeight: 1.07, letterSpacing: '-0.04em' }}>See how it works.<br /><Box component="span" sx={{ color: primary[200] }}>Choose your side.</Box></Typography>
                            </Box>
                            <Box sx={{ maxWidth: 390, pb: { md: 0.75 } }}>
                                <Typography sx={{ color: neutral[300], fontSize: '1.05rem', lineHeight: 1.8 }}>Take a tour as a buyer, seller, or lawyer. Each account gives you a different view of the same property journey.</Typography>
                                <Typography variant="body2" sx={{ color: neutral[0], mt: 2 }}>Demo accounts are ready to use. No registration needed.</Typography>
                            </Box>
                        </Box>

                        <Box component="section" aria-label="Choose a demo role" sx={{ display: 'grid', gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'repeat(3, minmax(0, 1fr))' }, gap: 2.5 }}>
                            {roles.map((card) => (
                                <Box component="article" key={card.role} sx={{ bgcolor: neutral[50], color: neutral[800], borderRadius: radius.lg, p: { xs: 3, lg: 3.5 }, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                        <Box sx={{ display: 'flex', p: 1.25, bgcolor: card.tone[50], color: card.tone[700], borderRadius: radius.md, '& svg': { width: 26, height: 26 } }}>{card.icon}</Box>
                                        <Typography sx={{ fontFamily: editorialFont, color: neutral[400], fontSize: '1.4rem' }}>{card.number}</Typography>
                                    </Box>
                                    <Typography component="h2" sx={{ fontFamily: editorialFont, fontSize: '2rem', lineHeight: 1.2 }}>{card.role}</Typography>
                                    <Typography sx={{ fontWeight: 600, mt: 1.5, mb: 1 }}>{card.title}</Typography>
                                    <Typography variant="body2" sx={{ color: neutral[600], lineHeight: 1.7, minHeight: { md: 48 } }}>{card.description}</Typography>
                                    <Box component="ul" sx={{ listStyle: 'none', p: 0, mt: 3, mb: 3, '& li': { display: 'flex', alignItems: 'flex-start', gap: 1.25, py: 0.75, color: neutral[600], fontSize: '0.8125rem', lineHeight: 1.6, '&:before': { content: '"—"', color: card.tone[700], flexShrink: 0 } } }}>
                                        {card.features.map((feature) => <Box component="li" key={feature}>{feature}</Box>)}
                                    </Box>
                                    <Box sx={{ mt: 'auto', borderTop: `1px solid ${neutral[200]}`, pt: 2.5 }}>
                                        <Box sx={{ bgcolor: neutral[100], borderRadius: radius.md, p: 1.75, mb: 2 }}>
                                            <Typography variant="caption" sx={{ color: neutral[600] }}>Demo email</Typography>
                                            <Typography sx={{ fontFamily: 'monospace', fontSize: '0.8125rem', color: neutral[700], overflowWrap: 'anywhere', mt: 0.5, mb: 1.5 }}>{card.email}</Typography>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1 }}><Typography variant="caption" sx={{ color: neutral[600] }}>Password</Typography><Typography sx={{ fontFamily: 'monospace', fontSize: '0.8125rem', color: neutral[700] }}>password</Typography></Box>
                                        </Box>
                                        <Button LinkComponent={Link} href={route('login') + `?email=${encodeURIComponent(card.email)}&password=password`} variant="contained" fullWidth endIcon={<ArrowForwardRounded sx={{ fontSize: 18 }} />} sx={{ py: 1.25, borderRadius: radius.sm }}>Explore as {card.role.toLowerCase()}</Button>
                                    </Box>
                                </Box>
                            ))}
                        </Box>

                        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 3, py: { xs: 4, md: 5 }, mt: { xs: 2, md: 3 } }}>
                            <Box sx={{ maxWidth: 600 }}><Typography component="h2" sx={{ fontFamily: editorialFont, fontSize: '1.8rem', fontWeight: 400, mb: 1 }}>One deal. Three perspectives.</Typography><Typography variant="body2" sx={{ color: neutral[300], lineHeight: 1.8 }}>Choose a role to open the login page with the demo details filled in. Sign in to explore, then log out to try another perspective.</Typography></Box>
                            <Button LinkComponent={Link} href={route('home')} endIcon={<ArrowForwardRounded sx={{ fontSize: 18 }} />} sx={{ color: neutral[0], fontWeight: 600, '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' } }}>Explore EstateHub</Button>
                        </Box>
                    </Box>

                    <Box component="footer" sx={{ borderTop: `1px solid ${line}`, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1.5, py: 3 }}><Typography variant="caption" sx={{ color: neutral[300] }}>© {new Date().getFullYear()} EstateHub</Typography><Typography variant="caption" sx={{ color: neutral[300] }}>A closer look at buying and selling directly.</Typography></Box>
                </Container>
            </Box>
        </>
    );
}
