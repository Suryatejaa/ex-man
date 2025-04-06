/* eslint-disable no-unused-vars */

import { Box, Button, FormControl, Input, InputLabel, Link, Typography } from "@mui/material";

import { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

import axios from "axios";

import { Visibility, VisibilityOff } from "@mui/icons-material";

import { IconButton } from "@mui/material";

// import { BoxesLoaderComponent } from "../components/BoxLoader";

export default function Login() {

  const navigate = useNavigate();

  const [userName, setUsername] = useState('');

  const [password, setPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState(' ');

  const [success, setSuccess] = useState(false);

  const [isValid, setIsValid] = useState(false);

  useEffect(() => {

    setIsValid(userName.length >= 4 && password.length >= 8);

  }, [userName, password]);

  const handleSubmit = async () => {

    try {

      const response = await axios.post("/api/users/login", {

        credential: userName,

        password: password

      }, {

        withCredentials: true

      });

      console.log("Login Successful:", response.data);

      setError("");

      setSuccess(true);

      navigate('/dashboard');

    } catch (error) {

      if (error.code === 'ERR_NETWORK') {

        console.error("Network Error: Unable to reach the server. Please check your connection or server status.");

        alert("Network Error: Unable to reach the server. Please try again later.");

      } else {

        console.error("Login Error:", error);

        setError("Please check credentials");

      }

    }

  };

  return (

    <Box

      sx={{

        display: 'flex',

        flexDirection: 'column',

        alignItems: 'center',

        justifyContent: 'center',

        height: "auto",

        padding: 2,

        border: "1px solid",

        borderBlockColor: "black",

        borderRadius: '20px',

        backgroundColor: '#fff',

        width: { xs: '90%', sm: '300px' },

        margin: 'auto',

      }}

    >

      {/* <BoxesLoaderComponent/> */}

      <Typography variant="h4" gutterBottom>

        Login {userName && `as ${userName}`}

      </Typography>

      <FormControl sx={{ width: '100%', maxWidth: 400, marginBottom: 2 }}>

        <InputLabel htmlFor="username">Username</InputLabel>

        <Input id="username"

          value={userName}

          onChange={(e) => {

            setUsername(e.target.value);

            setError('');

          }

          } />

      </FormControl>

      <FormControl sx={{ width: '100%', maxWidth: 400, marginBottom: 2 }}>

        <InputLabel htmlFor="password">Password</InputLabel>

        <Input id="password"

          type={showPassword ? "text" : "password"}

          value={password}

          onChange={

            (e) => {

              setPassword(e.target.value);

              setError("");

            }

          }

          endAdornment={

            <IconButton onClick={() => setShowPassword(!showPassword)}>

              {showPassword ? <VisibilityOff /> : <Visibility />}

            </IconButton>

          }

        />

      </FormControl>

      <Button

        variant="contained"

        color="primary"

        sx={{ width: '100%', maxWidth: 400, marginBottom: 2 }}

        onClick={handleSubmit}

        disabled={!isValid}

      >

        {success ? 'Loading...' : 'Login'}

      </Button>

      {error &&

        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: 400 }}>

          <Typography color="error" variant="caption">{error}</Typography>

        </Box>

      }

      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: 400 }}>

        <Link href="/signup" underline="hover">

          Sign Up

        </Link>

        <Link href="/forgot-password" underline="hover">

          Forgot Password?

        </Link>

      </Box>

    </Box>

  );

}













