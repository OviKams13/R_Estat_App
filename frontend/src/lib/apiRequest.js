import axios from "axios";

const apiRequest = axios.create({
  baseURL: "https://estat-backend.onrender.com/api",
  withCredentials: true,
});

export default apiRequest;
