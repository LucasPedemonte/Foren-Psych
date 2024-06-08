const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const axios = require("axios"); // Import axios for making HTTP requests

const app = express();
const PORT = 5001;

// Configure multer for file uploads
const upload = multer({ dest: "uploads/" });

app.use(cors());
app.use(bodyParser.json({ limit: "10mb" })); // Increase the body limit
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" })); // Increase the body limit

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

    // Read the file content
    const fileContent = fs.readFileSync(file.path);
    // Convert the file content to Base64
    const fileContentBase64 = Buffer.from(fileContent).toString("base64");

    // Prepare payload for the API request
    const apiUrl = "https://api.private-ai.com/deid/v3/process/files/base64";
    const apiKey = "49ec5e3b62eb484ea048f3ed1b28e8f6";

    const payload = {
      file: {
        data: fileContentBase64,
        content_type: "application/xml", // Change this if the file type is different
      },
      entity_detection: {
        accuracy: "high",
        return_entity: true,
      },
    };

    const headers = {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    };

    // Make the API request
    axios
      .post(apiUrl, payload, { headers })
      .then((response) => {
        console.log("Success:", response.data);
        res.json({
          message: "File uploaded and processed successfully",
          apiResponse: response.data,
        });
      })
      .catch((error) => {
        console.error(
          "Error making API request:",
          error.response ? error.response.data : error.message
        );
        res
          .status(500)
          .json({ error: "Error making API request", details: error.message });
      });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
