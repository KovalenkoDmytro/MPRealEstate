import React from 'react';
import { Stack, Box, Typography, Button } from '@mui/material';
import theme from "@/theme";

type MakeOfferPromptProps = {
    onMakeOffer: () => void;
};

export const MakeOfferPrompt = ({ onMakeOffer }: MakeOfferPromptProps) => {
    return (
        <Stack
            sx={{
                backgroundColor: "#fff",
                border: `1px solid #E5E7EB`,
                borderRadius: theme.shape.borderRadius,
                p: theme.shape.padding,
            }}
            direction="row" justifyContent="space-between" alignItems="center">
            <Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    No Offer Yet
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Make an offer to show your interest in this property
                </Typography>
            </Box>
            <Button
                variant="contained"
                onClick={onMakeOffer}
                sx={{
                    bgcolor: '#4a2c4a',
                    '&:hover': { bgcolor: '#3a223a' },
                    textTransform: 'none',
                    px: 4
                }}
            >
                Make an Offer
            </Button>
        </Stack>
    );
};
