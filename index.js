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
You are an expert university-level academic summarizer with the ability of ChatGPT.
Your job is to summarize a long PDF exactly like expert tutors prepare EXAM NOTES.

Follow these rules STRICTLY:

=======================================================
📌 **A. PROCESSING METHOD**
=======================================================
1. Read the document **page-by-page** exactly in order.
2. Extract **every important concept from each page** without skipping anything.
3. Detect headings, subheadings, definitions, diagrams (describe them in text), lists, and explanations.

=======================================================
📌 **B. WHAT TO INCLUDE (VERY IMPORTANT)**
=======================================================
For every page, include:

• Definitions  
• Explanations (simple + exam-ready)  
• Key concepts  
• Architecture / block diagrams (describe in text)  
• Models / phases / steps  
• Components  
• Features / characteristics  
• Advantages  
• Disadvantages  
• Applications  
• Limitations  
• Differences (if any appear)  
• Numerical formulas or rules  
• Any exam-focused explanation  

These are exactly what students write in **2-mark, 5-mark, 10-mark** questions.

=======================================================
📌 **C. WHAT TO EXCLUDE (NEVER INCLUDE)**
=======================================================
❌ Stories  
❌ Long real-world examples  
❌ Unnecessary case studies  
❌ Repeated content  
❌ Extra descriptions  
❌ Citations or references  

Keep it clean and exam focused.

=======================================================
📌 **D. OUTPUT FORMAT (STRICT FORMAT)** 
=======================================================
You MUST follow this exact structure:

# 📘 SUMMARY OF DOCUMENT

## 🔵 Page 1 Summary
• Bullet point (15–25 words, crisp, clear, exam-oriented)  
• Bullet point  
• Bullet point  

## 🔵 Page 2 Summary
• Bullet point  
• Bullet point  

(continue this until the last page)

=======================================================
📌 **E. BULLET POINT RULES**
=======================================================
✔ Each bullet must be 15–25 words  
✔ One idea per bullet  
✔ No paragraphs  
✔ No numbering inside bullets  
✔ Professional academic tone  

=======================================================
📌 **F. LENGTH REQUIREMENT**
=======================================================
➡ Produce **minimum 40–70 bullet points**  
➡ More if content is heavy  
➡ NEVER shorten too much; preserve knowledge density  

=======================================================
📌 **G. FINAL REQUIREMENT**
=======================================================
Only output:
- Headings
- Subheadings
- Bullet points  

NO intro, NO analysis, NO explanation of what you are doing.

=======================================================
📌 **DOCUMENT TEXT BELOW**  
(Summarize it using all rules above.)
=======================================================

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
                     STUDY RESOURCE FINDER
============================================================ */
app.post("/api/resources", async (req, res) => {
  try {
    const { topic } = req.body;

    const prompt = `
Provide high-quality learning resources for the topic: **${topic}**

STRICT RULES (must follow exactly):

1️⃣ NEVER generate or guess ANY direct YouTube video URL  
   Examples of what is FORBIDDEN:
   - https://youtube.com/watch?v=...
   - https://youtu.be/...

2️⃣ For YouTube videos, ONLY return SEARCH LINKS in this format:
   https://www.youtube.com/results?search_query=<TITLE+WORDS>

3️⃣ For websites, ONLY provide REAL existing links such as:
   - GeeksforGeeks
   - Javatpoint
   - Tutorialspoint
   - Official documentation

4️⃣ Format response EXACTLY as Markdown:
### 📝 Short Explanation
...

### 🌐 Best Websites
- [Name](https://valid-link.com)

### 🎥 YouTube Video Topics (safe)
- Title: Deadlock in OS (Easy Explanation)
  Search: https://www.youtube.com/results?search_query=Deadlock+in+Operating+System

Return ONLY valid Markdown output.
    `;

    const output = await askGemini(prompt);
    res.json({ success: true, output });

  } catch (err) {
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
