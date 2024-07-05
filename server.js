require("dotenv").config();
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
app.use(bodyParser.json({ limit: "10mb" }));
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

    console.log(`File uploaded: ${file.originalname}`);
    console.log(`Email: ${recipientEmail}`);

    const fileContent = file.buffer; // Use file.buffer instead of reading from file system
    const fileContentBase64 = fileContent.toString("base64");
    const apiUrl = "https://api.private-ai.com/deid/v3/process/files/base64";
    const apiKey = process.env.PRIVATE_AI_API_KEY;

    const payload = {
      file: {
        data: fileContentBase64,
        content_type: "application/pdf",
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

    // Asynchronous function to process the file
    const processFile = async () => {
      try {
        const response = await axios.post(apiUrl, payload, { headers });
        console.log("Success:", response.data);

        const processedText = response.data.processed_text;
        console.log(processedText);

        const assistantResponse = await getAssistant(processedText);
        console.log("Assistant Response:", assistantResponse);

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

        await sendEmail(recipientEmail, subject, body);
      } catch (error) {
        console.error("Error processing file:", error);
      }
    };

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

    // Trigger the asynchronous processing
    processFile();

    res.json({
      message:
        "File uploaded and is being processed. You will receive an email once processing is complete.",
    });
  } catch (error) {
    console.error(
      "Error making API request:",
      error.response ? error.response.data : error.message
    );
    res
      .status(500)
      .json({ error: "Error making API request", details: error.message });
  }
});

// Default route to serve your frontend
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "build", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
