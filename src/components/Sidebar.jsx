import React, { useState } from "react";
import { Box, List, ListItem, ListItemText, ListItemButton, Tooltip } from "@mui/material";
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';
import SummarizeOutlinedIcon from '@mui/icons-material/SummarizeOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import AddCardOutlinedIcon from '@mui/icons-material/AddCardOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { useLocation, useNavigate } from "react-router-dom";

import axios from "axios";
import Cookies from "js-cookie";

export default function Sidebar({ onNavigate = () => { }, activeSection }) { // Default onNavigate to an empty function
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = async () => {
        console.log('called logout function');
        try {
            await axios.post("/api/users/logout", {}, { withCredentials: true });
            Cookies.remove('token');
            Cookies.remove('refreshToken');
            navigate("/");
        } catch (error) {
            console.error("Logout Error:", error);
            alert("Logout failed. Please try again.");
        }
    };

    const navItems = [
        { label: "Dashboard", section: "summary", icon: <InsertChartOutlinedIcon /> },
        { label: "Manage", section: "manage", icon: <AddCardOutlinedIcon /> },
        { label: "Reports", section: "reports", icon: <SummarizeOutlinedIcon /> },
        { label: "Settings", section: "settings", icon: <SettingsOutlinedIcon /> },
        { label: "Logout", onClick: handleLogout, icon: <LogoutOutlinedIcon /> },
    ];

    if (location.pathname === "/" || location.pathname === "/signup" || location.pathname === "/login") {
        return null;
    }

    return (
        <Box
            sx={{
                width: 50, // Fixed width for the sidebar
                height: "calc(100vh - 64px)", // Adjust height to account for the header (assuming header height is 64px)
                backgroundColor: "#f5f5f5",
                paddingRight: 0,
                paddingTop: 2,
                paddingLeft: 0,
                paddingBottom: 0,
                top: 50, // Stick below the header (assuming header height is 64px)
                left: 0,
                boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
                position: "fixed", // Ensure the sidebar remains fixed
                overflow: "hidden",
            }}
        >
            <List>
                {navItems.map((item) => (
                    <ListItem key={item.label} disablePadding>
                        <Tooltip
                            title={item.label}
                            placement="right"
                            arrow                            
                        >
                            <ListItemButton
                                onClick={item.onClick || (() => onNavigate(item.section))}
                                sx={{
                                    alignItems: "center",
                                    backgroundColor: activeSection === item.section ? "#afcfe1" : "transparent",
                                    "&:hover": {
                                        backgroundColor: "#d0d0d0",
                                    },
                                }}
                            >
                                {item.icon}
                                {/* Remove expanded text */}
                            </ListItemButton>
                        </Tooltip>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
}