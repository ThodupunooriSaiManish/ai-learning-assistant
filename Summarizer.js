import React, { useState } from "react";
import { summarizeText } from "../api";

export default function Summarizer() {
  const [text, setText] = useState("");
  const [maxPoints, setMaxPoints] = useState(5);
  const [loading, setLoading] = useState(false);

  async function handleSummarize() {
    if (!text.trim()) {
      alert("Enter some text to summarize.");
      return;
    }

    try {
      setLoading(true);

      const result = await summarizeText(text, maxPoints);

      if (!result || !result.success) {
        alert(result?.output || "Summary failed.");
        setLoading(false);
        return;
      }

      const summaryHtml = (result.output || "")
        .toString()
        .replace(/\n/g, "<br>");

      const tab = window.open("", "_blank");
      tab.document.write(`
        <html>
        <head><title>Summary</title></head>
        <body style="font-family:Arial; padding:20px; line-height:1.6">
          <h2>Summary Output</h2>
          <div>${summaryHtml}</div>
        </body>
        </html>
      `);
      tab.document.close();
    } catch (err) {
      alert("Error summarizing.");
    }

    setLoading(false);
  }

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Summarizer</h2>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text here..."
        className="p-3 border rounded w-full h-48 mb-4"
      />

      <input
        type="number"
        min="1"
        max="20"
        value={maxPoints}
        onChange={(e) => setMaxPoints(e.target.value)}
        className="p-2 border rounded mb-4"
      />

      <button
        onClick={handleSummarize}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Summarizing..." : "Summarize"}
      </button>
    </div>
  );
}
