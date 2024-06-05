const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");

const app = express();
const PORT = 5001;

// Configure multer for file uploads
const upload = multer({ dest: "uploads/" });

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Endpoint to handle file uploads
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Prepare the form data
    const formData = new FormData();
    formData.append(
      "file",
      fs.createReadStream(path.join(__dirname, file.path))
    );

    // API endpoint where you want to post the file
    const apiUrl = "https://api.private-ai.com/deid/v3/process/files/uri";

    // Additional data to send in the API request
    const additionalData = {
      link_batch: false,
      entity_detection: {
        accuracy: "high",
        return_entity: true,
      },
      processed_text: {
        type: "MARKER",
        pattern: "[UNIQUE_NUMBERED_ENTITY_TYPE]",
      },
    };

    // Append additional data to form data
    formData.append("json", JSON.stringify(additionalData));

    // Subscription key
    const subscriptionKey = "49ec5e3b62eb484ea048f3ed1b28e8f6"; // Replace with your actual subscription key

    // Post the file to the API
    const apiResponse = await axios.post(apiUrl, formData, {
      headers: {
        ...formData.getHeaders(),
        "Ocp-Apim-Subscription-Key": subscriptionKey,
      },
    });

    // Clean up the uploaded file if no longer needed
    fs.unlinkSync(path.join(__dirname, file.path));

    res.json({
      message: "File uploaded and posted to API successfully",
      apiResponse: apiResponse.data,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
