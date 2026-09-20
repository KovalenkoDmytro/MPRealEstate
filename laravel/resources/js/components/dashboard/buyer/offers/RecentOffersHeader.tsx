import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import { primary } from '@/design/tokens';

const RecentOffersHeader = ({total}: {total: number}) => {

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: { xs: 'flex-start', sm: 'center' },
                flexDirection: { xs: 'column', sm: 'row' },
                gap: { xs: 1.5, sm: 2 },
                width: '100%',
            }}
        >
            {/* Left Side: Text Content */}
            <Box>
                <Typography
                    variant="h6"
                    component="h2"
                    sx={{
                        fontWeight: 800,
                        color: 'text.primary',
                        lineHeight: 1.2,
                        mb: 0.5,
                        fontSize: { xs: '1.1rem', sm: '1.25rem' },
                    }}
                >
                    Recent Offers
                </Typography>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontWeight: 400 }}
                >
                    Track all your property offers
                </Typography>
            </Box>

            {/* Right Side: Badge/Chip */}
            <Chip
                label={`${total} Total`}
                sx={{
                    backgroundColor: primary[50],
                    color: primary[700],
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    height: '32px',
                    alignSelf: { xs: 'flex-start', sm: 'center' },
                    '& .MuiChip-label': {
                        paddingLeft: 2,
                        paddingRight: 2,
                    },
                }}
            />
        </Box>
    );
};

export default RecentOffersHeader;
