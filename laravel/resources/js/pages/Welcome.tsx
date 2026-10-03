import { Head, Link } from '@inertiajs/react';
import { Box, Button, Container, Stack, Typography } from '@mui/material';
import { ArrowForwardRounded, NorthEastRounded } from '@mui/icons-material';
import ApplicationLogo from '@/components/ApplicationLogo';
import { User, UserRole } from '@/types';
import { neutral, primary, radius } from '@/design/tokens';
import theme from '@/theme';

type WelcomeProps = {
    auth: { user: User | null };
    canLogin: boolean;
    canRegister: boolean;
    stats?: Partial<{ users: number; listings: number; deals: number }>;
};

const editorialFont = 'Georgia, "Times New Roman", serif';
const line = 'rgba(255,255,255,0.2)';
const sectionHeading = { fontFamily: editorialFont, fontWeight: 400, fontSize: { xs: '2.1rem', md: '3rem' }, lineHeight: 1.15, letterSpacing: '-0.035em' };
const textLinkSx = { p: 0, minWidth: 0, color: 'inherit', fontWeight: 600, textTransform: 'none', borderRadius: 0, justifyContent: 'flex-start', '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' }, '&:focus-visible': { outline: `2px solid ${primary[300]}`, outlineOffset: 5 } };

function getRoleAction(user: User) {
    if (user.role === UserRole.Seller) return { label: 'Create a listing', href: route('listings.create') };
    if (user.role === UserRole.Lawyer) return { label: 'Open your deals', href: route('lawyer.deals.index') };
    return { label: 'Browse listings', href: route('listings.index') };
}

export default function Welcome({ auth, canLogin, canRegister, stats }: WelcomeProps) {
    const user = auth?.user ?? null;
    const mainAction = user ? getRoleAction(user) : canRegister ? { label: 'Find your next home', href: route('register') } : canLogin ? { label: 'Find your next home', href: route('login') } : null;
    const sellerAction = user?.role === UserRole.Seller ? { label: 'Create a listing', href: route('listings.create') } : !user && canRegister ? { label: 'Start selling', href: route('register') } : user ? { label: 'Go to your workspace', href: route('dashboard') } : canLogin ? { label: 'Log in to get started', href: route('login') } : null;
    const buyerAction = user?.role === UserRole.Buyer || user?.role === UserRole.Admin ? { label: 'Browse listings', href: route('listings.index') } : !user && canRegister ? { label: 'Start your search', href: route('register') } : !user && canLogin ? { label: 'Log in to explore', href: route('login') } : user ? getRoleAction(user) : null;
    const marketplace = [
        { value: stats?.listings ?? 0, label: 'property listings' },
        { value: stats?.users ?? 0, label: 'registered members' },
        { value: stats?.deals ?? 0, label: 'online deals' },
    ];
    const steps = [
        { number: '01', title: 'Find each other.', description: 'List your property or find a home you like. Contact the owner and arrange a viewing.' },
        { number: '02', title: 'Make your move.', description: 'Send an offer, agree on the terms, and keep track of the deal in your shared workspace.' },
        { number: '03', title: 'Work toward closing.', description: 'Follow the milestones, organise documents, and bring your lawyer into the process.' },
    ];

    return (
        <>
            <Head title="EstateHub | Your home. Your next move." />
            <Box sx={{ minHeight: '100dvh', background: theme.palette.background.gradient, backgroundAttachment: 'fixed', color: neutral[0] }}>
                <Container maxWidth={false} sx={{ maxWidth: 1440, px: { xs: 2.5, sm: 4, md: 6 } }}>
                    <Box component="header" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, py: { xs: 2.5, md: 3.5 }, borderBottom: `1px solid ${line}` }}>
                        <Stack direction="row" spacing={1.25} alignItems="center">
                            <Box sx={{ display: 'flex', p: 1, bgcolor: primary[600], borderRadius: radius.sm }}><ApplicationLogo width={24} height={24} /></Box>
                            <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, letterSpacing: '-0.03em' }}>EstateHub</Typography>
                        </Stack>
                        <Stack component="nav" aria-label="Main navigation" direction="row" spacing={{ xs: 1.5, md: 4 }} alignItems="center">
                            <Button component="a" href="#buy-and-sell" sx={{ ...textLinkSx, display: { xs: 'none', md: 'inline-flex' }, color: neutral[300], fontWeight: 400 }}>Buy & sell</Button>
                            <Button component="a" href="#how-it-works" sx={{ ...textLinkSx, display: { xs: 'none', md: 'inline-flex' }, color: neutral[300], fontWeight: 400 }}>How it works</Button>
                            {user ? <Button LinkComponent={Link} href={route('dashboard')} endIcon={<ArrowForwardRounded />} sx={{ ...textLinkSx, color: neutral[0] }}>Your workspace</Button> : <>
                                {canLogin && <Button LinkComponent={Link} href={route('login')} sx={{ ...textLinkSx, color: neutral[0] }}>Log in</Button>}
                                {canRegister && <Button LinkComponent={Link} href={route('register')} variant="contained" sx={{ bgcolor: neutral[50], color: neutral[900], borderRadius: radius.sm, px: { xs: 1.5, sm: 2.5 }, '&:hover': { bgcolor: neutral[200] } }}>Get started</Button>}
                            </>}
                        </Stack>
                    </Box>

                    <Box component="main">
                        <Box component="section" sx={{ display: 'grid', gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: '1fr 1fr' }, gap: { xs: 4, md: 7 }, alignItems: 'center', py: { xs: 5, md: 7 } }}>
                            <Box>
                                <Typography sx={{ color: neutral[300], fontSize: '0.72rem', letterSpacing: '0.17em', fontWeight: 600, mb: 3 }}>REAL ESTATE, DIRECT.</Typography>
                                <Typography component="h1" sx={{ fontFamily: editorialFont, fontSize: { xs: '3.1rem', sm: '4rem', lg: '5.1rem' }, fontWeight: 400, lineHeight: 1.03, letterSpacing: '-0.045em' }}>Buy and sell.<br /><Box component="span" sx={{ color: primary[200] }}>On your terms.</Box></Typography>
                                <Typography sx={{ color: neutral[300], fontSize: { xs: '1rem', md: '1.1rem' }, lineHeight: 1.8, mt: 3, maxWidth: 420 }}>Find a home. Speak directly with the owner. Keep your offer, documents, and next steps in one place.</Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2.5, alignItems: 'center', mt: 4 }}>
                                    {mainAction && <Button LinkComponent={Link} href={mainAction.href} variant="contained" endIcon={<ArrowForwardRounded />} sx={{ px: 3, py: 1.5, borderRadius: radius.sm }}>{mainAction.label}</Button>}
                                    <Button component="a" href="#buy-and-sell" sx={{ ...textLinkSx, color: neutral[0] }}>I’m selling a property <NorthEastRounded sx={{ fontSize: 17, ml: 1 }} /></Button>
                                </Box>
                                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 2, mt: { xs: 5, md: 7 }, pt: 3, borderTop: `1px solid ${line}`, maxWidth: 480 }}>
                                    {marketplace.map((stat) => <Box key={stat.label}><Typography sx={{ fontFamily: editorialFont, fontSize: '2rem', lineHeight: 1.2, fontVariantNumeric: 'tabular-nums' }}>{stat.value.toLocaleString('en-US')}</Typography><Typography sx={{ color: neutral[300], fontSize: '0.75rem', mt: 0.75 }}>{stat.label}</Typography></Box>)}
                                </Box>
                            </Box>
                            <Box component="figure" sx={{ m: 0, minWidth: 0 }}>
                                <Box component="img" src="/images/home/house-exterior.jpg" alt="A modern home with a garden and an open terrace" fetchPriority="high" sx={{ display: 'block', width: '100%', height: { xs: 330, sm: 420, md: 550 }, objectFit: 'cover', objectPosition: 'center', borderRadius: radius.lg }} />
                                <Box component="figcaption" sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, mt: 1.5, color: neutral[300], fontSize: '0.7rem', letterSpacing: '0.03em' }}><Box component="span">A place for your next chapter.</Box><Box component="span">EstateHub</Box></Box>
                            </Box>
                        </Box>

                        <Box component="section" id="buy-and-sell" sx={{ scrollMarginTop: 24, bgcolor: neutral[50], color: neutral[800], borderRadius: radius.lg, p: { xs: 3, md: 5 }, my: { xs: 2, md: 4 }, display: 'grid', gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: '1fr 1fr' }, gap: { xs: 4, md: 6 } }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                                <Typography sx={{ ...sectionHeading, mb: 3 }}>A home is personal.<br />The process should be, too.</Typography>
                                <Box component="img" src="/images/home/home-interior.jpg" alt="Sunlit dining and living spaces with natural wood finishes" loading="lazy" sx={{ width: '100%', height: { xs: 230, md: 320 }, objectFit: 'cover', borderRadius: radius.md, mt: 'auto' }} />
                            </Box>
                            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                <Box sx={{ pb: 4, borderBottom: `1px solid ${neutral[200]}` }}>
                                    <Typography variant="caption" sx={{ color: primary[700], letterSpacing: '0.08em', fontWeight: 600 }}>FOR BUYERS</Typography>
                                    <Typography component="h3" sx={{ fontSize: '1.5rem', fontWeight: 600, mt: 1, mb: 1.5, letterSpacing: '-0.025em' }}>Find the right place. Meet the owner.</Typography>
                                    <Typography sx={{ color: neutral[600], lineHeight: 1.8, maxWidth: 440 }}>Explore listings, ask questions, and arrange a visit. When it feels right, make your offer directly.</Typography>
                                    {buyerAction && <Button LinkComponent={Link} href={buyerAction.href} endIcon={<ArrowForwardRounded />} sx={{ ...textLinkSx, color: primary[700], mt: 2 }}>{buyerAction.label}</Button>}
                                </Box>
                                <Box sx={{ pt: 4 }}>
                                    <Typography variant="caption" sx={{ color: primary[700], letterSpacing: '0.08em', fontWeight: 600 }}>FOR SELLERS</Typography>
                                    <Typography component="h3" sx={{ fontSize: '1.5rem', fontWeight: 600, mt: 1, mb: 1.5, letterSpacing: '-0.025em' }}>Your property. Your conversation.</Typography>
                                    <Typography sx={{ color: neutral[600], lineHeight: 1.8, maxWidth: 440 }}>Publish your listing, manage viewings, and review offers. Stay involved from the first enquiry to the final agreement.</Typography>
                                    {sellerAction && <Button LinkComponent={Link} href={sellerAction.href} endIcon={<ArrowForwardRounded />} sx={{ ...textLinkSx, color: primary[700], mt: 2 }}>{sellerAction.label}</Button>}
                                </Box>
                            </Box>
                        </Box>

                        <Box component="section" id="how-it-works" sx={{ scrollMarginTop: 24, py: { xs: 5, md: 7 } }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 3, flexWrap: 'wrap', mb: 5 }}>
                                <Typography component="h2" sx={sectionHeading}>From first hello<br />to the next set of keys.</Typography>
                                <Typography sx={{ color: neutral[300], maxWidth: 350, lineHeight: 1.8 }}>One workspace for both sides, with clear milestones and room for your lawyer.</Typography>
                            </Box>
                            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'repeat(3, minmax(0, 1fr))' }, gap: { xs: 3, md: 5 } }}>
                                {steps.map((step) => <Box key={step.number} sx={{ borderTop: `1px solid ${line}`, pt: 2.5 }}><Typography sx={{ fontFamily: editorialFont, color: primary[200], fontSize: '2.2rem', mb: 2 }}>{step.number}</Typography><Typography component="h3" sx={{ fontSize: '1.15rem', fontWeight: 600, mb: 1.5 }}>{step.title}</Typography><Typography variant="body2" sx={{ color: neutral[300], lineHeight: 1.9, maxWidth: 340 }}>{step.description}</Typography></Box>)}
                            </Box>
                        </Box>

                        <Box component="section" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 3, py: 4, borderTop: `1px solid ${line}`, borderBottom: `1px solid ${line}` }}>
                            <Box><Typography component="h2" sx={{ ...sectionHeading, fontSize: { xs: '2rem', md: '2.6rem' } }}>Ready for your next move?</Typography><Typography variant="body2" sx={{ color: neutral[300], mt: 1.5 }}>Start with a property. Take it one step at a time.</Typography></Box>
                            {mainAction && <Button LinkComponent={Link} href={mainAction.href} variant="contained" endIcon={<ArrowForwardRounded />} sx={{ bgcolor: neutral[50], color: neutral[900], px: 3, py: 1.5, borderRadius: radius.sm, '&:hover': { bgcolor: neutral[200] } }}>{user ? mainAction.label : 'Create your account'}</Button>}
                        </Box>
                    </Box>

                    <Box component="footer" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, py: 3.5 }}>
                        <Typography variant="caption" sx={{ color: neutral[300] }}>© {new Date().getFullYear()} EstateHub</Typography>
                        <Stack direction="row" spacing={3} alignItems="center"><Typography variant="caption" sx={{ color: neutral[300], display: { xs: 'none', sm: 'block' } }}>Photography via Unsplash</Typography><Button LinkComponent={Link} href={route('demo')} sx={{ ...textLinkSx, color: neutral[0], fontSize: '0.8rem' }}>Try the demo <NorthEastRounded sx={{ fontSize: 15, ml: 0.75 }} /></Button></Stack>
                    </Box>
                </Container>
            </Box>
        </>
    );
}
