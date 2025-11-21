import React, { useState } from "react";
import { generateQuiz } from "../api";

export default function Quiz() {
  const [topic, setTopic] = useState("");
  const [questions, setQuestions] = useState(5);
  const [loading, setLoading] = useState(false);

  async function handleQuiz() {
    if (!topic.trim()) return alert("Enter a topic!");

    setLoading(true);

    const result = await generateQuiz(topic, "", questions);

    if (!result.success) {
      alert("Quiz generation failed");
      setLoading(false);
      return;
    }

    const html = result.output.replace(/\n/g, "<br>");
    const tab = window.open("", "_blank");

    tab.document.write(`
      <html>
      <head><title>AI Quiz</title></head>
      <body style="font-family:Arial;padding:20px;">
        <h2>Generated Quiz</h2>
        <div>${html}</div>
      </body>
      </html>
    `);

    tab.document.close();
    setLoading(false);
  }

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-3">Quiz Generator</h2>

      <input
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        className="border p-3 w-full rounded mb-3"
        placeholder="Enter topic"
      />

      <input
        type="number"
        value={questions}
        min="1"
        max="20"
        onChange={(e) => setQuestions(e.target.value)}
        className="border p-2 rounded mb-4"
      />

      <button
        onClick={handleQuiz}
        className="bg-orange-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Generating..." : "Generate Quiz"}
      </button>
    </div>
  );
}
