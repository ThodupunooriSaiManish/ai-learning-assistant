import React, { useState } from "react";
import { generateNotes } from "../api";

export default function Notes() {
  const [topic, setTopic] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleNotes() {
    if (!topic.trim()) return alert("Enter a topic");

    setLoading(true);

    const result = await generateNotes(topic, text);

    if (!result.success) {
      alert("Error generating notes");
      setLoading(false);
      return;
    }

    const html = result.output.replace(/\n/g, "<br>");
    const tab = window.open("", "_blank");

    tab.document.write(`
      <html>
      <head><title>Study Notes</title></head>
      <body style="font-family:Arial;padding:20px;">
        <h2>Study Notes</h2>
        <div>${html}</div>
      </body>
      </html>
    `);

    tab.document.close();

    setLoading(false);
  }

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-3">Notes Generator</h2>

      <input
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="Enter topic"
        className="border p-3 w-full rounded mb-3"
      />

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Optional reference text..."
        className="border p-3 w-full h-40 rounded mb-4"
      />

      <button
        onClick={handleNotes}
        className="bg-purple-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Generating..." : "Generate Notes"}
      </button>
    </div>
  );
}
