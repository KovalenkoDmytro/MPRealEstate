import { User } from "@/types";
import { Box, Typography, Stack, Paper } from "@mui/material";
import theme from "@/theme";
import IconContainer from "@/components/common/IconContainer";
import IconUser from "@/icons/IconUser";
import IconMail from "@/icons/IconMail";
import IconBadge from "@/icons/IconBadge";

export default function DealPersonInfo({ person }: { person: User }) {
    return (
        <Paper
            elevation={0}
            sx={{
                p: theme.shape.padding,
                borderRadius: theme.shape.borderRadius,
                bgcolor: theme.palette.background.white,
                border: `1px solid ${theme.palette.border.main}`,
                mb: 3,
            }}
        >

            <Stack direction="row" spacing={1.5} alignItems="center" mb={4}>
                <IconContainer>
                    <IconUser />
                </IconContainer>
                <Typography variant="h5" fontWeight="bold">
                    {person.role}
                </Typography>
            </Stack>


            <Box
                display="grid"
                gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr" }}
                gap={3}
            >

                <Stack direction="row" spacing={1.5} alignItems="flex-start">
                    <IconBadge/>
                    <Box>
                        <Typography variant="caption" sx={{ display: "block", mb: 0.2 }}>
                            Name:
                        </Typography>
                        <Typography variant="body2" fontWeight="medium" sx={{ color: `${theme.palette.primary.main}` }}>
                            {person.name}
                        </Typography>
                    </Box>
                </Stack>


                <Stack direction="row" spacing={1.5} alignItems="flex-start">
                    <IconMail/>
                    <Box>
                        <Typography variant="caption" sx={{ display: "block", mb: 0.2 }}>
                            Email:
                        </Typography>
                        <Typography variant="body2" fontWeight="medium" sx={{ color: `${theme.palette.primary.main}` }}>
                            {person.email}
                        </Typography>
                    </Box>
                </Stack>
            </Box>
        </Paper>
    );
}
