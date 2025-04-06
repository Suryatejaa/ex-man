import React from "react";
import { Card, CardContent, Typography, IconButton, Box } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import apiClient from "../utilis/apiClient";

export default function ItemCard({ item, mode, typeOf, handleCloseModal,onRefresh }) {

    const itemsCap = (string) => {
        if (!string) return string;
        if (string.length === 0) return string;
        if (string.length === 1) return string.toUpperCase();
        if (string.length === 2) return string.charAt(0).toUpperCase() + string.charAt(1).toLowerCase();
        if (string.length === 3) return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
        if (string.length > 3) return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();

        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    const title = itemsCap(item.title);
    const source = itemsCap(item.source);
    const type = itemsCap(item.type);
    const category = itemsCap(item.category);

    const handleActionClick = async () => {
        try {
            if (mode === "delete") {
                if (typeOf === "income") {
                    const response = await apiClient.delete(`/income/${item._id}/`, { withCredentials: true });
                    console.log("Income deleted:", response.data);
                    alert("Income deleted successfully!");
                } else if (typeOf === "expense") {
                    const response = await apiClient.delete(`/expenses/${item._id}/`, { withCredentials: true });
                    alert("Expense deleted successfully!");
                    console.log("Expense deleted:", response.data);
                }
                handleCloseModal(); // Close the modal
                onRefresh(); //
            } else if (mode === "edit") {
                if (typeOf === "income") {
                    const response = await apiClient.put(`/income/${item._id}/`, { withCredentials: true });
                    console.log("Income updated:", response.data);
                } else if (typeOf === "expense") {
                    const response = await apiClient.put(`/expenses/${item._id}/`, { withCredentials: true });
                    console.log("Expense updated:", response.data);
                }
                handleCloseModal(); // Close the modal
                onRefresh(); //
            }
        } catch (error) {
            console.error("Error:", error.response?.data || error.message);
        }
    };

    return (
        <Card
            sx={{
                minWidth: "20px",
                marginBottom: 2,
                backgroundColor: "#fff",
                color: "#000",
                border: "2px solid",
                borderColor: "#000",
                borderRadius: 5,
            }}>


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
    );
}



