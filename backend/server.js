// backend/server.js
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const multer = require("multer");
const OpenAI = require("openai");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/ai", async (req, res) => {
  const { query } = req.body;

  try {
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
- suggest search query
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
If you need further assistance or encounter any issues during implementation, please provide the exact error messages and your Control-M environment details.
`;

	res.json({
		aiText: finalResponse
	});

  } catch (error) {
    console.error(error);
    res.status(500).send("Error");
  }
});

const upload = multer({ dest: "uploads/" });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
  
 

app.post("/analyze", upload.single("logfile"), async (req, res) => {
  const filePath = req.file.path;
  const data = fs.readFileSync(filePath, "utf-8");
  const lines = data.split("\n");

  // Step 1: Basic log analysis
  const errors = [];
  const warnings = [];
  const jobFailures = [];
  const ctmErrors = [];

  lines.forEach((line, idx) => {
    if (line.includes("ERROR")) errors.push({ line: idx + 1, text: line });
    if (line.includes("WARN")) warnings.push({ line: idx + 1, text: line });
    if (line.includes("NOTOK") || line.includes("ENDED_NOTOK")) jobFailures.push({ line: idx + 1, text: line });
    if (line.includes("CCM") || line.includes("Control-M")) {
      if (line.includes("ERROR")) ctmErrors.push({ line: idx + 1, text: line });
    }
  });

  // Step 2: AI Root Cause with OpenAI
  let aiRootCause = [];
  try {
	const lastLines = lines.slice(-200).join("\n"); // last 200 lines only
    const prompt = `Analyze these Control-M log lines and suggest root causes with solutions:\n\n${lastLines}`;
    const response = await openai.chat.completions.create({
      model:"gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
      max_tokens: 800,
    });
	
	// Debug
console.log("Full AI Response:", response);
console.log("AI Suggested Root Causes:", response.choices[0].message?.content);

    aiRootCause = response.choices[0].message.content
	
      .split("\n\n")
      .filter(Boolean) || ["No suggestions from AI"];
  } catch (err) {
    console.error("OpenAI Error:", err);
    aiRootCause = ["AI analysis failed"];
  }


});

app.listen(5000, () => console.log("Server running on port 5000"));