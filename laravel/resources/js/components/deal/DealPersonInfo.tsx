import { User } from "@/types";
import { Box, Typography } from "@mui/material";

export default function DealPersonInfo({ person }: { person: User }) {

    return (
        <Box mt={4} p={3} border="1px solid #e0e0e0" borderRadius={2}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
                👤 {person.role}
            </Typography>
            <Typography>
                <strong>Name:</strong> {person.name}
            </Typography>
            <Typography>
                <strong>Email:</strong> {person.email}
            </Typography>
        </Box>
    );
}
