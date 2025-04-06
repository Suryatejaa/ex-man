import React from "react";
import { Box, Typography } from "@mui/material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CurrencyPoundIcon from '@mui/icons-material/CurrencyPound';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import EuroIcon from '@mui/icons-material/Euro';
export default function LoadingIndicator({ message = "Loading..." }) {
  return (
    <>
      <Box
        sx={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          padding: 2,
          textAlign: "center",
          width: "50px"
        }}
      >
        <Box
          sx={{
            position: "absolute",
            right: "100%",
            animation: "float 1s ease-in-out infinite",
          }}
        >
          <CurrencyPoundIcon color="success" fontSize="large" />
        </Box>
        <Box
          sx={{
            position: "absolute",
            right: "50%",
            animation: "float 1.5s ease-in-out infinite",
          }}
        >
          <EuroIcon color="success" fontSize="large" />
        </Box>
        <Box
          sx={{
            position: "absolute",
            left: "50%",
            animation: "float 2s ease-in-out infinite",
          }}
        >
          <AttachMoneyIcon color="success" fontSize="large" />
        </Box>
        <Box
          sx={{
            position: "absolute",
            left: "90%",
            animation: "float 2.5s ease-in-out infinite",
          }}
        >
          <CurrencyRupeeIcon color="success" fontSize="large" />
        </Box>
        <style>
          {`
        @keyframes float {
          0% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0); }
        }
        `}
        </style>
      </Box>
      <Typography>{message}</Typography>
    </>
  );
}













