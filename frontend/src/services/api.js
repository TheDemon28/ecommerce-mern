import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV
    ? "http://localhost:2001/api"
    : "https://ecommerce-mern-pnd6.onrender.com/api");

const API = axios.create({
  baseURL: API_BASE_URL,
});

export default API;
