import React from 'react';
import { Box, Typography } from '@mui/material';

export default function ReportsSection() {
  return (
    <Box
      sx={{
        padding: '20px',
        height: '100%', // Fill the parent container's height
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center', // Center content vertically
        alignItems: 'center', // Center content horizontally
      }}
    >
      <Typography variant="h6" gutterBottom>
        Reports
      </Typography>
      {/* Add your reports component here */}
    </Box>
  );
}