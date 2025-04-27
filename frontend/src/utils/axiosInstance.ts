import axios from "axios";
import { toast } from "svelte-sonner";


const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api/",
  timeout: 5000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});


axiosInstance.interceptors.response.use(response => {
    if(response.data.message) {
        toast.success(response.data.message);
    }
    return response;
}, error => {
    const errorData = error.response?.data;
    if(axios.isAxiosError(error) && error.response?.data) {
        toast.error((errorData.message || errorData.error) || JSON.stringify(error));
        return;
    }
    toast.error("An error occurred");
    return Promise.reject(error);
});


export default axiosInstance;