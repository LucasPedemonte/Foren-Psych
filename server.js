const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const axios = require("axios");
const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");
const getAssistant = require("./src/openai-test");

const app = express();
const PORT = process.env.PORT || 5001;

// Configure multer for file uploads using memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.use(cors());
app.use(bodyParser.json({ limit: "10mb" })); // Increase the body limit
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));

// Serve static files from the 'build' directory
app.use(express.static(path.join(__dirname, "build")));

// Configure AWS SES client
const ses = new SESClient({ region: process.env.AWS_REGION });

// Endpoint to handle file uploads
app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    const recipientEmail = req.body.email;

    if (!file || !recipientEmail) {
      return res
        .status(400)
        .json({ error: "No file uploaded or email provided" });
    }

    // Log file details to the console for debugging
    console.log(`File uploaded: ${file.originalname}`);
    console.log(`Email: ${recipientEmail}`);

    // Convert the file content to Base64
    const fileContentBase64 = file.buffer.toString("base64");
    const apiUrl = "https://api.private-ai.com/deid/v3/process/files/base64";
    const apiKey = process.env.PRIVATE_AI_API_KEY;

    // Prepare payload for the API request
    const payload = {
      file: {
        data: fileContentBase64,
        content_type: "application/pdf", // Change this if the file type is different
      },
      entity_detection: {
        accuracy: "high",
        return_entity: true,
        entity_types: [
          { type: "ENABLE", value: ["NAME"] },
          { type: "ENABLE", value: ["DOB"] },
          { type: "ENABLE", value: ["CONDITION"] },
        ],
      },
    };

    const headers = {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    };

    // Make the API request
    console.log("Starting API request...");
    const response = await axios.post(apiUrl, payload, { headers });
    console.log("API request successful:", response.data);

    const processedText = response.data.processed_text;
    console.log("Processed text:", processedText);

    const assistantResponse = await getAssistant(processedText);
    console.log("Assistant response:", assistantResponse);

    // Extract the text value from the assistant response
    let body;
    if (
      assistantResponse &&
      Array.isArray(assistantResponse) &&
      assistantResponse[0].text &&
      assistantResponse[0].text.value
    ) {
      body = assistantResponse[0].text.value;
    } else {
      console.error("Unexpected response structure:", assistantResponse);
      body = "There was an error processing your request.";
    }

    const subject = "Processed File Content";

    // Function to send the processed text via email
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
        const result = await ses.send(new SendEmailCommand(params));
        console.log(`Email sent to ${recipientEmail}`, result);
      } catch (error) {
        console.error(`Error sending email to ${recipientEmail}`, error);
        throw error;
      }
    };

    // Send the processed text via email
    await sendEmail(recipientEmail, subject, body);

    res.json({
      message: "File uploaded, processed, and email sent successfully",
    });
  } catch (error) {
    console.error(
      "Error processing the request:",
      error.response ? error.response.data : error.message
    );
    res
      .status(500)
      .json({ error: "Error processing the request", details: error.message });
  }
});

// Default route to serve your frontend
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "build", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
