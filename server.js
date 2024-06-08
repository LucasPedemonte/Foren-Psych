const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 5001;

// Configure multer for file uploads
const upload = multer({ dest: "uploads/" });

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' })); // Increase the body limit
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' })); // Increase the body limit

// Endpoint to handle file uploads
app.post("/upload", upload.single("file"), (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Log file details to the console for debugging
    console.log(`File uploaded: ${file.originalname}`);
    console.log(`File saved to: ${file.path}`);

    // Respond with success message
    res.json({
      message: "File uploaded successfully",
      fileDetails: {
        originalName: file.originalname,
        storagePath: file.path,
      },
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
