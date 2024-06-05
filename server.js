const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5001;

// Enable CORS for all routes
app.use(cors());

// Parse incoming JSON requests
app.use(bodyParser.json());

// Define a route for your API
app.post("/deid/v3/process/text", (req, res) => {
  const { text, link_batch, entity_detection, processed_text } = req.body;

  // Simulate processing the request
  const response = {
    processedText: text.map((t) =>
      t.replace("John", "[NAME]").replace("Jane", "[NAME]")
    ),
    entities: [
      { entity: "John", type: "PERSON" },
      { entity: "Jane", type: "PERSON" },
    ],
  };

  res.json(response);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
