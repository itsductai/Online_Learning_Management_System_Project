import axios from "axios";

const API_URL = "http://localhost:7025/api/auth";


export const loginAPI = (email, password) => {
  return axios.post(`${API_URL}/login`, { email, password });
};

export const registerAPI = (name, email, password) => {
  return axios.post(`${API_URL}/register`, {name, email, password });
};

export const coursesAPI = () => {
  return axios.post(`${API_URL}/courses`, {});
};
