// backend/server.js
const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ OpenAI init
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY ,
  baseURL: "https://models.inference.ai.azure.com",
  defaultHeaders: {
    "api-key": process.env.OPENAI_API_KEY
  }
});

// ✅ Query-based AI API
app.post("/ai", async (req, res) => {
  const { query } = req.body;

  try {
    console.log("Query received:", query);

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You are a Control-M L3 Support Engineer.

For every issue:
1. Provide Issue Analysis
2. Provide Solution

Format:

## Issue Analysis

1. <Issue Name>:
   Description: ...
   Solution: ...

Rules:
- Always include article reference or search keywords
- Suggest search query
          `
        },
        {
          role: "user",
          content: query
        }
      ]
    });

    const aiText = response.choices[0].message.content.trim();

    const finalResponse = `
${aiText}

-----------------------------------------------------------------------------------------------------------
⚠️ Please test this solution in a non-production environment first.
If you need further assistance or encounter any issues, please provide exact error details.
`;

    res.json({ aiText: finalResponse });

  } catch (error) {
    console.error("AI ERROR:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// ✅ Simple test route
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

app.listen(5000, () => console.log("Server running on port 5000"));