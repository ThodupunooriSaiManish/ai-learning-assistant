import React, { useState } from "react";
import * as pdfjsLib from "pdfjs-dist/webpack";
import axios from "axios";

export default function DocSummarizer() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // ------------------- PDF TEXT EXTRACTION -------------------
  async function extractPdfText(pdfFile) {
    const arrayBuffer = await pdfFile.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let text = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map((item) => item.str).join(" ") + "\n";
    }

    return text;
  }

  // ------------------- MAIN HANDLER -------------------
  async function handleSummarize() {
    if (!file) return alert("Please upload a PDF or PPTX file.");

    setLoading(true);
    let extractedText = "";

    const ext = file.name.split(".").pop().toLowerCase();

    try {
      // ----- PDF -----
      if (ext === "pdf") {
        extractedText = await extractPdfText(file);
      }

      // ----- PPTX -----
      else if (ext === "pptx") {
        const form = new FormData();
        form.append("file", file);

        const res = await axios.post("http://localhost:4000/api/extract-ppt", form, {
          headers: { "Content-Type": "multipart/form-data" }
        });

        extractedText = res.data.text;
      }

      else {
        alert("Supported formats: PDF, PPTX");
        setLoading(false);
        return;
      }

      if (!extractedText || extractedText.length < 20) {
        alert("Could not extract text from document.");
        setLoading(false);
        return;
      }

      // ------------------- CALL EXAM-ORIENTED SUMMARIZER -------------------
      const res = await axios.post("http://localhost:4000/api/summarize-doc", {
        text: extractedText
      });

      if (!res.data.success) {
        alert("Summarization failed.");
        setLoading(false);
        return;
      }

      const summary = res.data.output;
      const html = summary.replace(/\n/g, "<br>");

      // ------------------- OPEN IN NEW TAB -------------------
      const tab = window.open("", "_blank");
      tab.document.write(`
        <html>
        <head><title>Exam-Oriented Summary</title></head>
        <body style="font-family:Arial; padding:20px; line-height:1.6;">
          <h2>Document Summary</h2>
          <div>${html}</div>
        </body>
        </html>
      `);
      tab.document.close();

    } catch (err) {
      console.error("Document Summarizer Error:", err);
      alert("Error summarizing the document.");
    }

    setLoading(false);
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-3">Document Summarizer (PDF/PPT)</h2>

      <input
        type="file"
        accept=".pdf,.pptx"
        onChange={(e) => setFile(e.target.files[0])}
        className="border p-3 w-full mb-4 rounded"
      />

      <button
        onClick={handleSummarize}
        className="bg-purple-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Processing..." : "Summarize Document"}
      </button>
    </div>
  );
}
