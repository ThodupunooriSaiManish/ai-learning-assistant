import React, { useState } from "react";
import { getResources } from "../api";

export default function ResourceFinder() {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSearch() {
    if (!topic.trim()) return alert("Enter a topic!");

    setLoading(true);

    const result = await getResources(topic);

    if (!result.success) {
      alert("Error fetching resources");
      setLoading(false);
      return;
    }

    const html = result.output
  .replace(/\n/g, "<br>")
  .replace(/\[(.*?)\]\((https?:\/\/.*?)\)/g, "<a href='$2' target='_blank'>$1</a>")
  .replace(/(https?:\/\/[^\s<]+)/g, "<a href='$1' target='_blank'>$1</a>");


    const tab = window.open("", "_blank");

    tab.document.write(`
      <html>
      <head><title>Study Resources</title></head>
      <body style="padding:20px;font-family:Arial;line-height:1.7">
        <h2>Best Study Resources for "${topic}"</h2>
        <div>${html}</div>
      </body>
      </html>
    `);

    tab.document.close();
    setLoading(false);
  }

  return (
    <div className="tool-card fade-in">
      <h2 className="text-xl font-bold mb-3">Study Resource Finder</h2>

      <input
        type="text"
        placeholder="Enter topic (ex: OS Deadlock, DBMS Indexing)"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        className="border p-3 w-full mb-3 rounded"
      />

      <button className="button-primary" onClick={handleSearch}>
        {loading ? "Searching..." : "Get Study Resources"}
      </button>
    </div>
  );
}
