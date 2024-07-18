// src/Components/Home.js
import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";
import CustomAvatar from "../Assets/Images/Logo.png"; // Replace with your actual image path
import { AuthContext } from "../AuthContext"; // Import AuthContext

const theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#00141F",
    },
    primary: {
      main: "#90CAF9",
    },
    secondary: {
      main: "#64B5F6",
    },
  },
});

const FileInputWrapper = styled("div")(({ theme }) => ({
  position: "relative",
  display: "flex",
  alignItems: "center",
  marginTop: theme.spacing(2),
  padding: theme.spacing(1),
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  width: "100%",
  backgroundColor: theme.palette.background.paper,
  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
  '& input[type="file"]': {
    display: "none",
  },
  "& label": {
    flex: "0 0 30%",
    padding: theme.spacing(1),
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    cursor: "pointer",
    textAlign: "center",
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    fontWeight: "bold",
    transition: "background-color 0.3s, transform 0.3s",
    "&:hover": {
      backgroundColor: theme.palette.primary.dark,
      transform: "scale(1.05)",
    },
  },
  "& .file-name": {
    flex: "1 1 70%",
    padding: theme.spacing(1),
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    textAlign: "center",
    color: theme.palette.text.primary,
    marginLeft: theme.spacing(1),
    backgroundColor: theme.palette.background.default,
    transition: "background-color 0.3s, box-shadow 0.3s",
    boxShadow: "inset 0px 1px 3px rgba(0, 0, 0, 0.1)",
    "&:hover": {
      backgroundColor: theme.palette.background.paper,
      boxShadow: "inset 0px 1px 5px rgba(0, 0, 0, 0.2)",
    },
  },
}));

const RemoveFileButton = styled(Button)(({ theme }) => ({
  marginLeft: theme.spacing(1),
  color: "#f44336",
  backgroundColor: "transparent",
  "&:hover": {
    backgroundColor: "transparent",
    color: "#d32f2f",
  },
}));

function Home() {
  const { user } = useContext(AuthContext); // Use context to get user
  const [email, setEmail] = useState(user ? user.email : "");
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (user) {
      setEmail(user.email);
    }
  }, [user]);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
  };

  const handleRemoveFile = () => {
    setFile(null);
    document.getElementById("file").value = null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !file) {
      alert("Please provide both an email and a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("email", email); // Add other necessary fields if required

    try {
      const response = await fetch(`/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Server responded with status ${response.status}: ${errorText}`
        );
      }

      const data = await response.json();
      console.log("Success:", data);
      alert("File processed successfully");
    } catch (error) {
      console.error("Error:", error);
      alert(`Error processing file: ${error.message}`);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ position: "absolute", top: 8, right: 8 }}>
        <Link to="/contact">
          <Button variant="contained" color="secondary">
            Contact Us
          </Button>
        </Link>
      </Box>
      <Container component="main" maxWidth="xs">
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
            Upload File and Submit Email
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1, width: "100%" }}
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
              value={email}
              onChange={handleEmailChange}
              sx={{ width: "100%" }}
            />
            <FileInputWrapper>
              <label htmlFor="file">Choose File</label>
              <div className="file-name">
                {file ? file.name : "No file chosen"}
              </div>
              <input
                type="file"
                id="file"
                name="file"
                onChange={handleFileChange}
              />
              {file && (
                <RemoveFileButton onClick={handleRemoveFile}>
                  X
                </RemoveFileButton>
              )}
            </FileInputWrapper>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Submit
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default Home;
