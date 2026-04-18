const pdfParse = require("pdf-parse");
const multer = require("multer");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

// file ni RAM lo store chesthundhi temporary processing ki best and manam later PDF parse chestham so disk lo save avvalsina avasaram ledhu
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
});

// edhi backend application instance
const app = express();

function cleanResumeText(text) {
  return text
    .replace(/\s+/g, " ") // multiple spaces → single space
    .replace(/\n+/g, "\n") // multiple new lines → single
    .trim(); // remove start/end spaces
}

const axios = require("axios");

async function analyzeResumeWithAI(text, jobDesc) {
  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `
You are a resume analyzer.

Compare the resume with the job description and return ONLY valid JSON.

Format:
{
  "score": number (0 to 100),
  "strengths": ["point1"],
  "weaknesses": ["point1"],
  "missingSkills": ["skill1"],
  "matchScore": number (0 to 100),
  "missingKeywords": ["keyword1"]
}

Rules:
- Always give at least 1 item per array

Resume:
${text}

Job Description:
${jobDesc}
`,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    const aiText = response.data.choices[0].message.content;

    let parsed;

    try {
      // 👉 clean unwanted text if any
      const cleanText = aiText.replace(/```json|```/g, "").trim();

      parsed = JSON.parse(cleanText);
    } catch (err) {
      console.log("JSON parse error:", err);
      parsed = { raw: aiText };
    }

    return parsed;
  } catch (error) {
    console.log("AI Error:", error.message);
    return "AI analysis failed";
  }
}

// frontend nunchi requests handle cheyyataniki
app.use(cors());
// json body parse cheyyataniki
app.use(express.json());

// simple test routing edhi
app.get("/", (req, res) => {
  res.send("Resume Analyzer backend is running");
});

app.post("/upload", upload.single("resume"), async (req, res) => {
  try {
    if (req.file.mimetype !== "application/pdf") {
      return res.status(400).json({
        error: "Only PDF files are allowed",
      });
    }

    if (req.file.size > 2 * 1024 * 1024) {
      return res.status(400).json({
        error: "File size exceeds 2MB limit",
      });
    }

    console.log("API KEY:", process.env.OPENROUTER_API_KEY);

    const buffer = req.file.buffer;

    // ✅ correct usage
    const data = await pdfParse(buffer);

    const rawText = data.text;

    const cleanedText = cleanResumeText(rawText);

    const jobDesc = req.body.jobDesc || "";

    const aiResult = await analyzeResumeWithAI(cleanedText, jobDesc);

    console.log("AI RESULT:\n", aiResult);
    console.log("RAW TEXT:\n", rawText);
    console.log("CLEANED TEXT:\n", cleanedText);

    res.json({
      message: "Analysis complete",
      analysis: aiResult,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "PDF parsing failed" });
  }
});

const PORT = process.env.PORT || 5000;

// server ni run cheyyataniki
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
