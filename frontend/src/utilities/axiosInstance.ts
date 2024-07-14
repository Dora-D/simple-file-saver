import axios from "axios";
import { deleteUserFromLocalStorage } from "./deleteUserFromLocalStorage";

const axiosInstance = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      deleteUserFromLocalStorage();
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
