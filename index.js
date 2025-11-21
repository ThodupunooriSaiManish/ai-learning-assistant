import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import multer from "multer";
import pptxParser from "pptx2json";

dotenv.config();

/* ============================================================
                        INITIALIZE APP
============================================================ */
const app = express();
app.use(cors());
app.use(express.json());

/* ============================================================
                        GEMINI INITIALIZATION
============================================================ */
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: process.env.MODEL });

console.log("🔥 Loaded MODEL:", process.env.MODEL);

// Safe wrapper
async function askGemini(prompt) {
  const result = await model.generateContent(prompt);
  return result.response.text();
}

/* ============================================================
                        FILE UPLOAD (PPT)
============================================================ */
const upload = multer({ storage: multer.memoryStorage() });

app.post("/api/summarize-doc", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim() === "") {
      return res.json({
        success: false,
        output: "No text provided.",
      });
    }

    const safeText = text.slice(0, 15000); // allow bigger PDF

    const prompt = `
You are an expert academic assistant.

Summarize the following document into highly exam-oriented points.
Strict rules:
- Extract only important points relevant for university exams.
- Include definitions, key concepts, architecture, components, advantages, disadvantages, steps, features, limitations.
- Ignore stories, irrelevant examples, unnecessary explanation.
- Keep each point crisp (10–18 words).
- Write ONLY bullet points.
- No headings, no intro, no conclusion.
- Output 12–20 points depending on content importance.

Document text:
${safeText}
`;

    const output = await askGemini(prompt);

    if (!output || typeof output !== "string") {
      return res.json({
        success: false,
        output: "AI returned empty response.",
      });
    }

    res.json({ success: true, output });

  } catch (err) {
    console.error("❌ DOC SUMMARY ERROR:", err);
    res.json({
      success: false,
      output: "Error summarizing document.",
    });
  }
});

/* ============================================================
                        NOTES GENERATOR
============================================================ */
app.post("/api/generate-notes", async (req, res) => {
  try {
    const { topic, text } = req.body;

    const prompt = `
Generate detailed, structured study notes for the topic: ${topic}

Reference text:
${text}

Sections:
- Definition
- Explanation
- Key Concepts
- Examples
- Summary
- 3 Practice Questions
`;

    const output = await askGemini(prompt);
    res.json({ success: true, output });
  } catch (err) {
    console.error("Notes error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/* ============================================================
                          SUMMARIZER
============================================================ */
app.post("/api/summarize", async (req, res) => {
  try {
    const { text, maxPoints } = req.body;

    if (!text || text.trim() === "") {
      return res.json({
        success: false,
        output: "No text provided for summarization.",
      });
    }

    const safeText = text.slice(0, 9000);

    const prompt = `
Summarize the following into ${maxPoints} bullet points.
Write ONLY the summary:

${safeText}
`;

    const output = await askGemini(prompt);

    if (!output || typeof output !== "string") {
      return res.json({
        success: false,
        output: "AI returned empty response. Try again.",
      });
    }

    res.json({ success: true, output });
  } catch (err) {
    console.error("❌ SUMMARY ERROR:", err);
    res.json({
      success: false,
      output: "Error summarizing text.",
    });
  }
});

/* ============================================================
                        QUIZ GENERATOR
============================================================ */
app.post("/api/generate-quiz", async (req, res) => {
  try {
    const { topic, numQuestions } = req.body;

    const prompt = `
Generate ${numQuestions} MCQ questions on: ${topic}

Format:
Q)
A)
B)
C)
D)
Correct Answer:
Explanation:
`;

    const output = await askGemini(prompt);
    res.json({ success: true, output });
  } catch (err) {
    console.error("Quiz error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/* ============================================================
                        STUDY PLAN
============================================================ */
app.post("/api/study-plan", async (req, res) => {
  try {
    const { goal, days, level } = req.body;

    const prompt = `
Create a ${days}-day study plan.

Goal: ${goal}
Level: ${level}

Include:
- Daily Plan
- Hours Required
- Weekly Review
- Weekly Test
`;

    const output = await askGemini(prompt);
    res.json({ success: true, output });
  } catch (err) {
    console.error("Study plan error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/* ============================================================
                        START SERVER
============================================================ */
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Gemini Server running on port ${PORT}`);
});
