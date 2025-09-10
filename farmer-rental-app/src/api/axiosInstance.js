import axios from "axios";

// Prefer environment variable so Docker/Compose can control the API base URL
// Fallback to "/api" which is proxied by Nginx in container; local dev still works if backend runs on 8080
const baseURL = process.env.REACT_APP_API_BASE_URL || "/api";

const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
