/* ----------------------------------------------------------------------------*/
/*   ( The Authentic JS/JAVA/PYTHON CodeBuff )
 ___ _                      _              _ 
 | _ ) |_  __ _ _ _ __ _ __| |_ __ ____ _ (_)
 | _ \ ' \/ _` | '_/ _` / _` \ V  V / _` || |
 |___/_||_\__,_|_| \__,_\__,_|\_/\_/\__,_|/ |
                                        |__/ 
 */
/* --------------------------------------------------------------------------*/

import React, { useState } from "react";
import {
  Avatar,
  Button,
  TextField,
  Typography,
  Container,
  Box,
} from "@mui/material";
import { register as registerUser } from "../services/AuthService";
import { useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    let tempErrors = {};
    if (!/^[A-Za-z][A-Za-z0-9]{2,15}$/.test(formData.username))
      tempErrors.username =
        "Username must start with a letter & contain only letters/numbers (3-16 chars)";

    if (!/^[A-Za-z ]+$/.test(formData.first_name))
      tempErrors.first_name = "Full name must contain only letters and spaces";

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      tempErrors.email = "Enter a valid email address";

    if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/.test(
        formData.password
      )
    )
      tempErrors.password =
        "Password must be 8–16 chars with upper, lower, number & special char";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const res = await registerUser(formData);
      if (res.access && res.refresh) {
        // Don't store tokens here — go to login page instead
        alert("Registration successful! Please login.");
        navigate("/login");
      } else {
        alert("Registration succeeded. Please login.");
        navigate("/login");
      }
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    }
  };

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "100vh",
        justifyContent: "center",
        pb: 10,
      }}
    >
      <Avatar sx={{ m: 1, bgcolor: "black" }}>
        <FaUser />
      </Avatar>
      <Typography component="h1" variant="h5" sx={{ fontFamily: "Anton" }}>
        R e g i s t e r
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ mt: 2, width: "100%" }}
      >
        <TextField
          margin="normal"
          fullWidth
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          error={!!errors.username}
          helperText={errors.username}
        />
        <TextField
          margin="normal"
          fullWidth
          label="Full Name"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
          error={!!errors.first_name}
          helperText={errors.first_name}
        />
        <TextField
          margin="normal"
          fullWidth
          label="Email Address"
          name="email"
          value={formData.email}
          onChange={handleChange}
          error={!!errors.email}
          helperText={errors.email}
        />
        <TextField
          margin="normal"
          fullWidth
          type="password"
          label="Password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          error={!!errors.password}
          helperText={errors.password}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{
            mt: 3,
            mb: 2,
            bgcolor: "black",
            "&:hover": { bgcolor: "#333" },
          }}
        >
          R e g i s t e r
        </Button>
      </Box>
    </Container>
  );
}
