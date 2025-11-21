import React, { useState } from "react";
import { chatRequest } from "../api";

export default function Chat() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleChat() {
    if (!message.trim()) return alert("Enter a question!");

    setLoading(true);

    const result = await chatRequest(message);

    if (!result.success) {
      alert("Error fetching answer");
      setLoading(false);
      return;
    }

    const answer = result.output.replace(/\n/g, "<br>");
    const tab = window.open("", "_blank");

    tab.document.write(`
      <html>
      <head><title>Doubt Solver</title></head>
      <body style="font-family:Arial;padding:20px;line-height:1.6">
        <h2>AI Response</h2>
        <div>${answer}</div>
      </body>
      </html>
    `);

    tab.document.close();
    setLoading(false);
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-3">Doubt Solver</h2>

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="border p-3 w-full h-40 mb-4 rounded"
        placeholder="Ask your question..."
      />

      <button
        onClick={handleChat}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Thinking..." : "Ask"}
      </button>
    </div>
  );
}
