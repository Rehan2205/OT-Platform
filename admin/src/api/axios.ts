import axios from "axios";

export default axios.create({
  baseURL: "http://localhost:4000/api", // backend URL
  withCredentials: true,
});
