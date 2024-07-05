const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const axios = require("axios");
const AWS = require("aws-sdk");
require("dotenv").config();

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
    const recipientEmail = req.body.email; // Get the email from the request body

    if (!file || !recipientEmail) {
      return res
        .status(400)
        .json({ error: "No file uploaded or email provided" });
    }

    // Log file details to the console for debugging
    console.log(`File uploaded: ${file.originalname}`);
    console.log(`File saved to: ${file.path}`);
    console.log(`Email: ${recipientEmail}`);

    // Read the file content
    const fileContent = fs.readFileSync(file.path);
    // Convert the file content to Base64
    const fileContentBase64 = Buffer.from(fileContent).toString("base64");

    // Prepare payload for the API request
    const apiUrl = "https://api.private-ai.com/deid/v3/process/files/base64";
    const apiKey = process.env.PRIVATE_AI_API_KEY;
    const SES_CONFIG = {
      accessKeyId: process.env.AWS_SES_KEY,
      secretAccessKey: process.env.AWS_SES_SECRET_KEY,
      region: process.env.AWS_REGION,
    };

    const AWS_SES = new AWS.SES(SES_CONFIG);

    const sendEmail = async (recipientEmail, subject, body) => {
      const params = {
        Source: process.env.SOURCE_EMAIL,
        Destination: {
          ToAddresses: [recipientEmail],
        },
        Message: {
          Subject: {
            Data: subject,
          },
          Body: {
            Text: {
              Data: body,
            },
          },
        },
      };

      console.log("Sending email with the following parameters:");
      console.log(params);

      try {
        const result = await AWS_SES.sendEmail(params).promise();
        console.log(`Email sent to ${recipientEmail}`, result);
      } catch (error) {
        console.error(`Error sending email to ${recipientEmail}`, error);
        if (error.code) {
          console.error(`Error code: ${error.code}`);
        }
        if (error.message) {
          console.error(`Error message: ${error.message}`);
        }
        if (error.stack) {
          console.error(`Error stack: ${error.stack}`);
        }
      }
    };

    const payload = {
      file: {
        data: fileContentBase64,
        content_type: "application/pdf", // Change this if the file type is different
      },
      entity_detection: {
        accuracy: "high",
        return_entity: true,
        entity_types: [
          {
            type: "ENABLE",
            value: ["NAME"],
          },
          {
            type: "ENABLE",
            value: ["DOB"],
          },
          {
            type: "ENABLE",
            value: ["CONDITION"],
          },
        ],
      },
    };

    const headers = {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    };

    // Make the API request
    axios
      .post(apiUrl, payload, { headers })
      .then(async (response) => {
        console.log("Success:", response.data);

        const processedText = response.data.processed_text;
        console.log(processedText);

        // Send the processed text via email
        const subject = "Processed File Content";
        const body = processedText;

        await sendEmail(recipientEmail, subject, body);

        res.json({
          message: "File uploaded, processed, and email sent successfully",
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
