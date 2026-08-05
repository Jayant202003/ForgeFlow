const API_BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:3002"
    : "";

export default API_BASE_URL;