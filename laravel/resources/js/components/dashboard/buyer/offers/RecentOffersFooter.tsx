import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';

const RecentOffersFooter = ({ count = 8, href = "#" }) => {
    return (
        <Box
            sx={{
                padding: 2,
                display: 'flex',
                justifyContent: 'center',
                width: '100%'
            }}
        >
            <Link
                href={href}
                underline="hover"
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    color: '#5e3048',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    '&:hover': {
                        color: '#421f32',
                    }
                }}
            >
                See All {count} Offers
                <ArrowForwardRoundedIcon fontSize="small" />
            </Link>
        </Box>
    );
};

export default RecentOffersFooter;
