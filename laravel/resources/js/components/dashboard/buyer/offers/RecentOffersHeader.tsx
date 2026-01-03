
import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';

const RecentOffersHeader = ({total}: {total: number}) => {

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                backgroundColor: '#fff',
            }}
        >
            {/* Left Side: Text Content */}
            <Box>
                <Typography
                    variant="h6"
                    component="h2"
                    sx={{
                        fontWeight: 800,
                        color: '#1e1b2e',
                        lineHeight: 1.2,
                        mb: 0.5
                    }}
                >
                    Recent Offers
                </Typography>
                <Typography
                    variant="body2"
                    sx={{
                        color: '#7e8390',
                        fontWeight: 400
                    }}
                >
                    Track all your property offers
                </Typography>
            </Box>

            {/* Right Side: Badge/Chip */}
            <Chip
                label={`${total} Total`}
                sx={{
                    backgroundColor: '#fdf4f6',
                    color: '#5e3048',
                    fontWeight: 700,
                    borderRadius: '12px',
                    fontSize: '0.85rem',
                    height: '32px',
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
