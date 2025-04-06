import React from "react";
import { Box, isMuiElement,useMediaQuery } from "@mui/material";
import Header from "./header";
import Footer from "./Footer";


export default function DashboardLayout({ children, displayName,refreshTrigger }) {
    const isMobile = useMediaQuery('(max-width:600px)');
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "row",
                width: isMobile ? "100vw" : "100%", 
                height: isMobile ? "100%":"100vh", 
                overflow: "hidden", 
                "&::-webkit-scrollbar": {
                    display: "none", 
                },
                "& *": {
                    scrollbarWidth: "none", 
                },
            }}
        >
            <Header displayName={displayName} refreshTrigger={refreshTrigger} />
            <Box
                sx={{
                    display: "flex",
                    flex: 1,
                    height: "calc(100vh - 128px)", 
                    overflow: "hidden", 
                    width: "100%", 
                }}
            >
                {children}
            </Box>
            <Footer />
        </Box>
    );
}



