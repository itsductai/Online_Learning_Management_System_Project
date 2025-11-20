// src/services/text2sqlAPI.js
import axios from "axios";

// Text-to-SQL API chạy bằng FastAPI (Python)
const BASE_URL = "http://127.0.0.1:8000";

export async function runTextToSql(query) {
  const res = await axios.post(`${BASE_URL}/search`, { query });
  return res.data;
}

export async function getTextToSqlStats() {
  const res = await axios.get(`${BASE_URL}/stats`);
  return res.data;
}

export async function getTextToSqlSuggest(prefix) {
  const res = await axios.post(`${BASE_URL}/suggest`, { prefix });
  return res.data;
}
