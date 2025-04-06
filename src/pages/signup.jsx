import React from "react";

import { Box, Button, FormControl, Input, InputLabel, Typography, Link } from "@mui/material";

import { Visibility, VisibilityOff } from "@mui/icons-material";

import { IconButton } from "@mui/material";

import { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

import axios from "axios";

export default function Signup() {

  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState('');

  const [userName, setUsername] = useState('');

  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');

  const [confirmPassword, setConfirmPassword] = useState('');

  const [formErrors, setFormErrors] = useState({});

  const [isValid, setIsValid] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateField = (field, value) => {

    const errors = { ...formErrors };

    if (field === "username" && !/^[a-zA-Z0-9._]{4,}$/.test(value)) {

      errors.username = "Username must be at least 4 characters and contain only letters, numbers, dots, or underscores.";

    } else if (field === "email" && !/.+@.+\..+/.test(value)) {

      errors.email = "Invalid email address.";

    } else if (field === "password" && !/(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}/.test(value)) {

      errors.password = "Password must be at least 8 characters, include an uppercase letter, a lowercase letter, and a special character.";

    } else if (field === "confirmPassword" && value !== password) {

      errors.confirmPassword = "Passwords do not match.";

    } else {

      delete errors[field];

    }

    setFormErrors(errors);

  };

  useEffect(() => {

    setIsValid(Object.keys(formErrors).length === 0 && displayName && userName && email && password && confirmPassword);

  }, [formErrors, displayName, userName, email, password, confirmPassword]);

  const handleSubmit = async () => {

    try {

      const response = await axios.post("/api/users/signup", {

        displayName,

        username: userName,

        email,

        password,

        confirmPassword

      }, {

        withCredentials: true

      });

      console.log("Signup Successful:", response.data);

      navigate('/dashboard');

      alert("Signup Successful");

    } catch (error) {

      console.error("Signup Error:", error);

      alert("Signup Error: Please try again.");

    }

  };

  return (

    <Box

      sx={{

        display: 'flex',

        flexDirection: 'column',

        alignItems: 'center',

        justifyContent: 'center',

        padding: 2,

        border: "1px solid",

        borderBlockColor: "black",

        borderRadius: '20px',

        backgroundColor: '#fff',

        width: { xs: '90%', sm: '300px' },

        margin: 'auto',

      }}

    >

      <Typography variant="h4" gutterBottom>

        Sign Up

      </Typography>

      <FormControl sx={{ width: '100%', marginBottom: 2 }}>

        <InputLabel htmlFor="displayName">Display Name</InputLabel>

        <Input id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />

      </FormControl>

      <FormControl sx={{ width: '100%', marginBottom: 2 }} error={!!formErrors.username}>

        <InputLabel htmlFor="username">Username</InputLabel>

        <Input

          id="username"

          value={userName}

          onChange={(e) => {

            setUsername(e.target.value);

            validateField("username", e.target.value);

          }}

        />

        {formErrors.username && <Typography color="error" variant="caption">{formErrors.username}</Typography>}

      </FormControl>

      <FormControl sx={{ width: '100%', marginBottom: 2 }} error={!!formErrors.email}>

        <InputLabel htmlFor="email">Email</InputLabel>

        <Input

          id="email"

          value={email}

          onChange={(e) => {

            setEmail(e.target.value);

            validateField("email", e.target.value);

          }}

        />

        {formErrors.email && <Typography color="error" variant="caption">{formErrors.email}</Typography>}

      </FormControl>

      <FormControl sx={{ width: '100%', marginBottom: 2 }} error={!!formErrors.password}>

        <InputLabel htmlFor="password">Password</InputLabel>

        <Input

          id="password"

          type={showPassword ? "text" : "password"}

          value={password}

          onChange={(e) => {

            setPassword(e.target.value);

            validateField("password", e.target.value);

          }}

          endAdornment={

            <IconButton onClick={() => setShowPassword(!showPassword)}>

              {showPassword ? <VisibilityOff /> : <Visibility />}

            </IconButton>

          }

        />

        {formErrors.password && <Typography color="error" variant="caption">{formErrors.password}</Typography>}

      </FormControl>

      <FormControl sx={{ width: '100%', marginBottom: 2 }} error={!!formErrors.confirmPassword}>

        <InputLabel htmlFor="confirmPassword">Confirm Password</InputLabel>

        <Input

          id="confirmPassword"

          type={showConfirmPassword ? "text" : "password"}

          value={confirmPassword}

          onChange={(e) => {

            setConfirmPassword(e.target.value);

            validateField("confirmPassword", e.target.value);

          }}

          endAdornment={

            <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)}>

              {showConfirmPassword ? <VisibilityOff /> : <Visibility />}

            </IconButton>

          }

        />

        {formErrors.confirmPassword && <Typography color="error" variant="caption">{formErrors.confirmPassword}</Typography>}

      </FormControl>

      <Button

        variant="contained"

        color="primary"

        sx={{ width: '100%', marginBottom: 2 }}

        onClick={handleSubmit}

        disabled={!isValid}

      >

        Sign Up

      </Button>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>

        <Link href="/login" underline="hover">

          Already have an account? Login

        </Link>

      </Box>

    </Box>

  );

}













