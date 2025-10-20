import axios from "axios";

// Create an axios instance specifically for server-side requests
const serverAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1",
});

export default serverAxios;