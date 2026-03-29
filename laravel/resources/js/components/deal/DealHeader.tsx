import { Deal } from "@/types";
import { Box, Typography, Stack, Paper } from "@mui/material";
import theme from "@/theme";
import IconDollar from "@/icons/IconDollar";
import IconContainer from "@/components/common/IconContainer";
import IconDocument from "@/icons/IconDocument";


export default function DealHeader({ deal }: { deal: Deal }) {
    return (
        <Paper
            elevation={0}
            sx={{
                p: theme.shape.padding,
                borderRadius: theme.shape.borderRadius,
                bgcolor: theme.palette.background.white,
                border: `1px solid ${theme.palette.border.main}`,
            }}
        >
            {/* Deal Title */}
            <Typography
                variant="h5"
                fontWeight="bold"
                sx={{  mb: 2}}
            >
                {deal.name}
            </Typography>

            {/* Amount and Description Grid */}
            <Box
                display="grid"
                gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }}
                gap={4}
            >
                {/* Amount Block */}
                <Stack direction="row" spacing={2} alignItems="center">

                    <IconContainer>
                        <IconDollar />
                    </IconContainer>

                    <Box>
                        <Typography variant="body2" sx={{ color: `${theme.palette.primary.main}`, mb: 0.5 }}>
                            Amount:
                        </Typography>
                        <Typography
                            variant="h6"
                            fontWeight="bold"
                        >
                            ${deal.amount.toLocaleString()}
                        </Typography>
                    </Box>
                </Stack>

                {/* Description Block */}
                <Stack direction="row" spacing={2} alignItems="center">

                    <IconContainer bgColor="#886277">
                        <IconDocument />
                    </IconContainer>

                    <Box>
                        <Typography variant="body2" sx={{ color:`${theme.palette.primary.main}`, mb: 0.5 }}>
                            Description:
                        </Typography>
                        <Typography
                            variant="h6"
                            fontWeight="bold"
                        >
                            {deal.deal_message}
                        </Typography>
                    </Box>
                </Stack>
            </Box>
        </Paper>
    );
}
