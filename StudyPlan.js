import React, { useState } from "react";
import { generateStudyPlan } from "../api";

export default function StudyPlan() {
  const [goal, setGoal] = useState("");
  const [days, setDays] = useState(7);
  const [level, setLevel] = useState("beginner");
  const [loading, setLoading] = useState(false);

  async function handlePlan() {
    if (!goal.trim()) return alert("Enter a study goal");

    setLoading(true);

    const result = await generateStudyPlan(goal, days, level);

    if (!result.success) {
      alert("Study plan failed");
      setLoading(false);
      return;
    }

    const html = result.output.replace(/\n/g, "<br>");
    const tab = window.open("", "_blank");

    tab.document.write(`
      <html>
      <head><title>Study Plan</title></head>
      <body style="font-family:Arial;padding:20px;">
        <h2>Personalized Study Plan</h2>
        <div>${html}</div>
      </body>
      </html>
    `);

    tab.document.close();
    setLoading(false);
  }

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-3">Study Plan Generator</h2>

      <input
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
        placeholder="Enter study goal"
        className="border p-3 w-full rounded mb-3"
      />

      <input
        type="number"
        value={days}
        min="1"
        max="30"
        onChange={(e) => setDays(e.target.value)}
        className="border p-2 rounded mb-3"
      />

      <select
        value={level}
        onChange={(e) => setLevel(e.target.value)}
        className="border p-2 rounded mb-4"
      >
        <option value="beginner">Beginner</option>
        <option value="intermediate">Intermediate</option>
        <option value="advanced">Advanced</option>
      </select>

      <button
        onClick={handlePlan}
        className="bg-red-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Generating..." : "Get Study Plan"}
      </button>
    </div>
  );
}
