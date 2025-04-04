import axios from "axios";

const apiRequest = axios.create({
  baseURL: "https://estat-iota.vercel.app/",
  withCredentials: true,
});

export default apiRequest;
