import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CustomAvatar from "../Assets/Images/Logo.png"; // Replace with your actual image path

const theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#000000", // Black
    },
    primary: {
      main: "#000000", // Black
    },
    secondary: {
      main: "#0B8A5E", // Secondary color
    },
    tertiary: {
      main: "#3B3B3B", // Grey
    },
  },
});

function Contact() {
  const navigate = useNavigate(); // Initialize the navigate function

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
    alert("Form submitted! Check the console for details.");
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ position: "absolute", top: 8, right: 8 }}>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => navigate("/home")}
        >
          Home
        </Button>
      </Box>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: "background.default",
            padding: 3,
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          <Avatar
            sx={{
              m: 1,
              bgcolor: "secondary.main",
              width: 180,
              height: 180,
              borderRadius: "50%",
              overflow: "hidden",
            }}
          >
            <img
              src={CustomAvatar}
              alt="Custom Avatar"
              style={{ width: "100%", height: "100%" }}
            />
          </Avatar>
          <Typography component="h1" variant="h5">
            Contact Us
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ mt: 1, width: "100%" }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Name"
              name="name"
              autoComplete="name"
              autoFocus
              value={formData.name}
              onChange={handleChange}
              sx={{ width: "100%" }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              sx={{ width: "100%" }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="message"
              label="Message"
              name="message"
              multiline
              rows={4}
              value={formData.message}
              onChange={handleChange}
              sx={{ width: "100%" }}
            />
            <Button
              type="submit"
              fullWidth
              variant="outlined"
              color="secondary"
              sx={{
                mt: 3,
                mb: 2,
                borderColor: theme.palette.tertiary.main,
                color: theme.palette.text.primary,
              }}
            >
              Send Message
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default Contact;
