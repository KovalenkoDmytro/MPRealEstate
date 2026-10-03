import { Button } from '@mui/material';
import { Link } from '@inertiajs/react';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';

export default function RecentOffersFooter({ count = 8, href = '#' }) {
    return (
        <Button
            LinkComponent={Link}
            href={href}
            endIcon={<ArrowForwardRoundedIcon />}
            sx={{
                color: 'common.white',
                border: '1px solid rgba(255,255,255,0.2)',
                bgcolor: 'rgba(255,255,255,0.06)',
                px: 2, py: 1,
                '&:hover': { bgcolor: 'rgba(255,255,255,0.14)', borderColor: 'rgba(255,255,255,0.4)' },
            }}
        >
            View all {count} offers
        </Button>
    );
}
