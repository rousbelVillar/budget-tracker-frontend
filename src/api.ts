import axios from "axios";

const API: any = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true,
  withXSRFToken: true,
  headers: {
    "Content-Type": "application/json; charset=utf-8",
  },
});

export default API;
