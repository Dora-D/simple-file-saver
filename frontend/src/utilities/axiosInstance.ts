import axios from "axios";
import { deleteUserFromLocalStorage } from "./deleteUserFromLocalStorage";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
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
