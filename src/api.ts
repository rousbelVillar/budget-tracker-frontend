import axios from "axios";
import { getCookie } from "./globals/globals";

const csrfToken = getCookie("csrf_access_token");
const API: any = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json; charset=utf-8",
    "X-CSRF-TOKEN": csrfToken || "",
  },
});

export default API;
