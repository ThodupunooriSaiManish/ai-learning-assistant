// ========================== IMPORTS (must stay at top) ==========================
import React, { useState, useEffect } from "react";
import "./styles.css";
import DocSummarizer from "./components/DocSummarizer";
import Chat from "./components/Chat";
import Notes from "./components/Notes";
import Summarizer from "./components/Summarizer";
import Quiz from "./components/Quiz";
import StudyPlan from "./components/StudyPlan";
// ==============================================================================



// ============================= DARK MODE TOGGLE ===============================
function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("ui-dark", dark);
  }, [dark]);

  return (
    <button
      onClick={() => setDark((d) => !d)}
      title="Toggle dark mode"
      className="theme-toggle"
      style={{
        position: "fixed",
        right: 18,
        top: 18,
        zIndex: 1200,
        padding: 10,
        borderRadius: 8,
        border: "none",
        cursor: "pointer",
        background: "var(--card-bg)",
      }}
    >
      {dark ? "☀️" : "🌙"}
    </button>
  );
}
// ==============================================================================



// ============================= FLOATING ACTION BUTTON ==========================
function Fab() {
  const scrollToTop = () =>
    window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div className="fab" onClick={scrollToTop} title="Go to Top">
      ↑
    </div>
  );
}
// ==============================================================================



// ================================= MAIN APP ===================================
function App() {
  return (
    <div className="app">

      {/* Dark mode button */}
      <ThemeToggle />

      {/* Floating scroll-to-top button */}
      <Fab />

      {/* Header */}
      <header>
        <h1>AI Personal Learning Assistant</h1>
        <p>Explain • Summarize • Generate Notes • Create Quizzes • Study Plans</p>
      </header>

      {/* Content Grid */}
      <main>
        <div className="grid">
          <section className="card"><Chat /></section>
          <section className="card"><Notes /></section>
          <section className="card"><Summarizer /></section>
          <section className="card"><Quiz /></section>
          <section className="card"><StudyPlan /></section>
          <section className="card"><DocSummarizer /></section>

        </div>
      </main>

      {/* Footer */}
      <footer>
        By: Thodupunoori Sai Manish — Vault of Codes Internship Project
      </footer>

    </div>
  );
}

export default App;
