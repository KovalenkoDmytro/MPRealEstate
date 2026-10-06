import { Stack, Box, Typography } from '@mui/material';
import SectionCard from "@/design/SectionCard";
import { LocalOfferOutlined } from "@mui/icons-material";
import { primary, radius } from "@/design/tokens";
import Button from "@/components/common/Button";

type MakeOfferPromptProps = {
    onMakeOffer: () => void;
    reOffer?: boolean;
};

export const MakeOfferPrompt = ({ onMakeOffer, reOffer = false }: MakeOfferPromptProps) => {
    return (
        <SectionCard tone="elevated" sx={{ p: { xs: 2.5, md: 3 } }}>
            <Stack spacing={2.5}>
                <Box sx={{ width: 44, height: 44, borderRadius: radius.md, bgcolor: primary[50], color: 'primary.main', display: 'grid', placeItems: 'center' }}><LocalOfferOutlined /></Box>
                <Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {reOffer ? 'Submit New Offer' : 'Make this home yours'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {reOffer
                            ? 'Your previous offer was declined. You may submit a new one.'
                            : 'Make an offer to show your interest in this property'}
                    </Typography>
                </Box>

                <Button version="primary" onClick={onMakeOffer} text={reOffer ? 'Make New Offer' : 'Make an Offer'} />

            </Stack>
        </SectionCard>
    );
};
