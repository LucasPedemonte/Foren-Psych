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
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig"; // Import your Firebase configuration
import CustomAvatar from "../Assets/Images/Logo.png"; // Import your PNG image here

const theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#00141F",
    },
  },
});

function SignIn() {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get("email");
    const password = data.get("password");

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("Signed in successfully:", userCredential.user);
      navigate("/Home"); // Navigate to home page on success
    } catch (error) {
      setError(
        "Failed to sign in. Please check your credentials and try again."
      );
      console.error("Error signing in:", error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
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
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            {error && (
              <Typography color="error" variant="body2" align="center">
                {error}
              </Typography>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
          </Box>
          <Typography variant="body2" color="text.secondary" align="center">
            Website developed by:
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center">
            Zachary Sevrens and Lucas Pedemonte
          </Typography>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default SignIn;
