import React, { useMemo } from "react";
import { Box, Typography, useMediaQuery } from "@mui/material";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);
export default function PieChart({ data }) {

    const isMobile = useMediaQuery('(max-width:600px)');

    const chartData = useMemo(() => {
        return {
            labels: ["Expenses", "EMIs", "Utilities", "Others", "Balance"],
            datasets: [
                {
                    data: [
                        data.totalExpense || 0,
                        data.totalEmis || 0,
                        data.totalUtilities || 0,
                        data.totalOthers || 0,
                        data.balance || 0,
                    ],
                    backgroundColor: ["#f44336", "#2196f3", "#ff9800", "#9c27b0", "#3f51b5"],
                    hoverOffset: 4,
                },
            ],
        };
    }, [data]);
    const options = useMemo(() => {
        return {
            plugins: {
                legend: {
                    display: true,
                    position: "bottom",
                    labels: {
                        boxWidth: 20,
                        padding: 5,
                    },
                },
            },
            maintainAspectRatio: false,
        };
    }, []);
    return (
        <Box sx={{ width: "100%", maxWidth: isMobile ? "300px" : "500px", margin: "auto" }}>
            <Box sx={{ width: "100%", maxWidth: isMobile ? "300px" : "500px", margin: "auto" }}>
                <Pie data={chartData} options={options} style={{ height: "300px", width: "100%" }} />

            </Box>
            <Box sx={{ width: "100%", maxWidth: isMobile ? "300px" : "500px", margin: "auto" }}>
                <Typography variant="h6" align="center" sx={{ marginTop: 2 }}>
                    Summary of Expenses
                </Typography>
                <Typography variant="body2" align="center" sx={{ marginTop: 1 }}>
                    Total Balance: ₹ {data.balance || 0}
                </Typography>
            </Box>
        </Box>

    );
}







