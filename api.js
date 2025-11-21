import axios from "axios";

const API_BASE = "http://localhost:4000";

export async function chatRequest(userMessage, context = []) {
  const res = await axios.post(`${API_BASE}/api/chat`, { userMessage, context });
  return res.data;
}

export async function generateNotes(topic, text = "") {
  const res = await axios.post(`${API_BASE}/api/generate-notes`, { topic, text });
  return res.data;
}

export async function summarizeText(text, maxPoints = 5) {
  const res = await axios.post(`${API_BASE}/api/summarize`, { text, maxPoints });
  return res.data;
}

export async function generateQuiz(topic, text = "", numQuestions = 5) {
  const res = await axios.post(`${API_BASE}/api/generate-quiz`, { topic, text, numQuestions });
  return res.data;
}

export async function generateStudyPlan(goal, days = 7, level = "beginner") {
  const res = await axios.post(`${API_BASE}/api/study-plan`, { goal, days, level });
  return res.data;
}
