/* eslint-disable no-unused-vars */
import React, { useEffect, useMemo, useState } from "react";
import { AppBar, Toolbar, Typography, Box, IconButton, Menu, MenuItem, Avatar, Divider } from "@mui/material";
import { blueGrey } from "@mui/material/colors";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useMediaQuery } from "@mui/material";
import apiClient from '../utilis/apiClient';


export default function Header({ displayName, profilePic = "/path", refreshTrigger }) {
  // const userInitial = useMemo(() => userName.charAt(0).toUpperCase(), [userName]);
  const secondary = blueGrey[300];
  const isMobile = useMediaQuery("(max-width:600px)");
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const [balance, setbalance] = useState('')
  
  useEffect(() => {
    async function fetchBalance() {
      const balance = await apiClient.get('/calculation/balance/')
      setbalance(balance.data)
    }
    fetchBalance()
    console.log('Balance refreshed')
  },[refreshTrigger])

  useEffect(() => {
    async function fetchBalance() {
      const balance = await apiClient.get('/calculation/balance/')
      setbalance(balance.data)
    }
    fetchBalance()
  },[])


  return (
    <AppBar position="fixed" sx={{ backgroundColor: secondary }}>
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: { xs: "wrap", sm: "nowrap" },
          gap: { xs: 1, sm: 2 },
        }}
      >
        <Typography variant="h6" sx={{ color: "black", marginLeft: "30px", flex: 1, textAlign: { xs: "center", sm: "left" } }}>
          Expense Tracker
        </Typography>
         <Typography variant="h6" sx={{ color: "black", marginLeft: "30px", flex: 1, textAlign: { xs: "center", sm: "right" } }}>
          You still have: ₹{balance}
        </Typography>
        <Box>
          <IconButton
            onClick={handleMenuOpen}
            sx={{
              color: "black",
              width: 48,
              height: 48,
              "&:focus": {
                outline: "none",
              },
              "&:active": {
                outline: "none",
              },
            }}
          >
            <AccountCircleIcon sx={{ fontSize: 42 }} />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            sx={{
              "& .MuiMenu-paper": {
                width: 300,
                borderRadius: 2,
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                padding: 2,
                flexDirection: "column",
                textAlign: "center",
              }}
            >
              <Avatar
                src={profilePic}
                alt={displayName}
                sx={{
                  width: 60,
                  height: 60,
                  marginBottom: 1,
                }}
              />
              <Typography variant="body1" fontWeight="bold">
                {displayName}
              </Typography>
            </Box>
            <Divider />
            <MenuItem onClick={handleMenuClose}>
              <Typography variant="body2">Edit Profile</Typography>
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <Typography variant="body2">Settings</Typography>
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <Typography variant="body2">Logout</Typography>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}











