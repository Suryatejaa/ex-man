/* eslint-disable no-unused-vars */
import React from "react";
import { Box, Typography } from "@mui/material";
import { green, blueGrey } from "@mui/material/colors";
export default function Footer() {
  const primary = green[600];
  const secondary = blueGrey[800];
  return (
    <Box
      sx={{
        width: "100vw",
        textAlign: "center",
        padding: { xs: 1, sm: 2 },
        backgroundColor: secondary,
        color: "#fff",
        position: "fixed",
        bottom: 0,
        left: 0,
        fontSize: { xs: "0.8em", sm: "1em" },
      }}
    >
      <Typography variant="body2">
        © {new Date().getFullYear()} Expense Tracker. All rights reserved.
      </Typography>
    </Box>
  );
}





