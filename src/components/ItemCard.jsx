import React, { useState } from "react";
import {
    Card,
    CardContent,
    Typography,
    IconButton,
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button,
    Snackbar,
    Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import apiClient from "../utilis/apiClient";

export default function ItemCard({ item, mode, typeOf, handleCloseModal, onRefresh, onSuccess }) {
    const [isDialogOpen, setIsDialogOpen] = useState(false); // State for confirmation dialog

    const itemsCap = (string) => {
        if (!string) return string;
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    };

    const title = itemsCap(item.title);
    const source = itemsCap(item.source);
    const type = itemsCap(item.type);
    const category = itemsCap(item.category);

    const handleDelete = async () => {
        try {
            if (typeOf === "income") {
                const response = await apiClient.delete(`/income/${item._id}/`, { withCredentials: true });
                console.log("Income deleted:", response.data);
            } else if (typeOf === "expense") {
                const response = await apiClient.delete(`/expenses/${item._id}/`, { withCredentials: true });
                console.log("Expense deleted:", response.data);
            }
            onRefresh(); // Trigger refresh

            onSuccess(`${typeOf === "income" ? "Income" : "Expense"} deleted successfully!`);
            handleCloseModal(); // Close the modal
        } catch (error) {
            console.error("Error:", error.response?.data || error.message);
        } finally {
            setIsDialogOpen(false); // Close the confirmation dialog
        }
    };

    const handleActionClick = () => {
        if (mode === "delete") {
            setIsDialogOpen(true); // Open confirmation dialog
        } else if (mode === "edit") {
            console.log("Edit action triggered");
            // Add edit logic here
        }
    };

    return (
        <>
            <Card
                sx={{
                    minWidth: "20px",
                    marginBottom: 2,
                    backgroundColor: "#fff",
                    color: "#000",
                    border: "2px solid",
                    borderColor: "#000",
                    borderRadius: 5,
                }}
            >
                <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <Box>
                            <Typography variant="h6">
                                {title || source} - ₹{item.amount}
                            </Typography>
                            <Typography variant="body3">{type || category}</Typography>
                            <Typography variant="body2">{item.date}</Typography>
                        </Box>
                        <IconButton
                            onClick={handleActionClick}
                            sx={{
                                color: mode === "delete" ? "red" : "#37474f",
                            }}
                        >
                            {mode === "delete" ? <DeleteIcon /> : <EditIcon />}
                        </IconButton>
                    </Box>
                </CardContent>
            </Card>

            {/* Confirmation Dialog */}
            <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this {typeOf === "income" ? "income" : "expense"}? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsDialogOpen(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDelete} color="error">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}