import axios from "axios";

const API_URL = "http://localhost:7025/api/auth";


export const loginAPI = (email, password) => {
  return axios.post(`${API_URL}/login`, { email, password });
};
