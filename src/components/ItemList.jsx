import React from "react";
import { Box, Typography } from "@mui/material";
import ItemCard from "./ItemCard";
export default function ItemList({ items,mode,type, onRefresh,onClick }) {
    if (!items || items.length === 0) {
        return (
            <Box sx={{ marginBottom: 4 }}>
                <Typography variant="h6" gutterBottom>
                    No list available
                </Typography>
            </Box>
        );
    }
  return (
    <Box sx={{ marginBottom: 4 }}>
      {items.map((item) => (
        <ItemCard key={item.id || item._id} item={item} mode={mode} typeOf={type} onRefresh={onRefresh} handleCloseModal={onClick}/>
      ))}
    </Box>
  );
}

