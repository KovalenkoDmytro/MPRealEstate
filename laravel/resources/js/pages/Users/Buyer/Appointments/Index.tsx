import React from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Chip,
} from "@mui/material";
import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import { RealEstateListing, User } from "@/types";
import { format } from "date-fns";

export interface BuyerAppointment {
    id: number;
    buyer_id: number;
    seller_id: number;
    real_estate_listing_id: number;

    scheduled_at: string;
    status: "pending" | "accepted" | "rejected";

    rejection_reason?: string | null;
    access_code?: string | null;

    seller: User;
    listing: RealEstateListing;
}

export default function BuyerAppointmentsPage({ appointments }: { appointments: BuyerAppointment[] }) {
    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold text-gray-800">📅 My Viewing Requests</h2>}
        >
            <Box maxWidth="900px" mx="auto" mt={4}>
                <Typography variant="h4" gutterBottom>
                    My Appointments
                </Typography>

                <Card>
                    <CardContent>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Listing</TableCell>
                                    <TableCell>Seller</TableCell>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Details</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {appointments.map((appt) => (
                                    <TableRow key={appt.id}>
                                        <TableCell>
                                            <Typography fontWeight="bold">{appt.listing.title}</Typography>
                                            <Typography variant="body2">${appt.listing.price}</Typography>
                                        </TableCell>

                                        <TableCell>{appt.seller.name}</TableCell>

                                        <TableCell>
                                            {format(new Date(appt.scheduled_at), "PPpp")}
                                        </TableCell>

                                        <TableCell>
                                            <Chip
                                                label={appt.status}
                                                color={
                                                    appt.status === "pending"
                                                        ? "warning"
                                                        : appt.status === "accepted"
                                                            ? "success"
                                                            : "error"
                                                }
                                            />
                                        </TableCell>

                                        <TableCell>
                                            {appt.status === "accepted" && appt.access_code && (
                                                <Typography color="green">
                                                    Access Code: <strong>{appt.access_code}</strong>
                                                </Typography>
                                            )}

                                            {appt.status === "rejected" && appt.rejection_reason && (
                                                <Typography color="error">
                                                    Reason: {appt.rejection_reason}
                                                </Typography>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </Box>
        </AuthenticatedLayout>
    );
}
