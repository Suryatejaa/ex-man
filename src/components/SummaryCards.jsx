import React, { useMemo } from "react";
import { Box, Typography, Card, CardContent } from "@mui/material";
import { useMediaQuery } from "@mui/material";


export default function SummaryCards({ data, onCardClick }) {
  const memoizedData = useMemo(() => data || {}, [data]);
  const isMobile = useMediaQuery("(max-width:600px)");
  const cardDetails = [
    { label: "Total Income", value: memoizedData.totalIncome, color: "#4caf50", key: "totalIncome" },
    { label: "Total Expenses", value: memoizedData.totalExpense, color: "#f44336", key: "totalExpense" },
    { label: "Total EMIs", value: memoizedData.totalEmis, color: "#2196f3", key: "totalEmis" },
    { label: "Total Credit Bills", value: memoizedData.totalCreditCard, color: "#ff5722", key: "totalCreditBlls" },
    { label: "Total Utilities", value: memoizedData.totalUtilities, color: "#ff9800", key: "totalUtilities" },
    { label: "Other Expenses", value: memoizedData.totalOthers, color: "#9c27b0", key: "otherExpenses" },
    // { label: "Balance", value: memoizedData.balance, color: "#3f51b5", key: "balance" },
  ];
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(2, 1fr)",
        justifyContent: "center",
        alignItems: "center",
        gap: isMobile ? 2 : 3,
      }}
    >
      {cardDetails.map((card) => (
        <Card
          key={card.label}
          sx={{
            minWidth: isMobile ? 150 : 200,
            backgroundColor: "#fff",
            color: "#000",
            border: "2px solid",
            borderColor: "#000",
            borderRadius: 5,
            cursor: "pointer",
            "&:hover": {
              backgroundColor: "#f5f5f5",
              color: card.color,
            },
          }}
          onClick={() => onCardClick(card.key)}
        >
          <CardContent>
            <Typography variant={isMobile ? "body1" : "h6"}>{card.label}</Typography>
            <Typography variant={isMobile ? "h6" : "h5"} fontWeight="bold">
              ₹ {card.value}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}







