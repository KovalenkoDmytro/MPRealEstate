import { Stack, Box, Typography } from '@mui/material';
import theme from "@/theme";
import Button from "@/components/common/Button";

type MakeOfferPromptProps = {
    onMakeOffer: () => void;
};

export const MakeOfferPrompt = ({ onMakeOffer }: MakeOfferPromptProps) => {
    return (
        <Stack
            sx={{
                backgroundColor: theme.palette.background.white,
                border: `1px solid #E5E7EB`,
                borderRadius: theme.shape.borderRadius,
                p: theme.shape.padding,
            }}
            direction="column" justifyContent="space-between" alignItems="center" gap={2}>
            <Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    No Offer Yet
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Make an offer to show your interest in this property
                </Typography>
            </Box>

            <Button version="primary" onClick={onMakeOffer} text="Make an Offer"/>


        </Stack>
    );
};
