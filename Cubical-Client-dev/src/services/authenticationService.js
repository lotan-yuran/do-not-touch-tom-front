import { createAxiosInstance } from "../config/axiosInstance";
const axiosInstance = createAxiosInstance(process.env.REACT_APP_SERVICE_API, "/api/");

export const checkUser = userId => {
  return axiosInstance.post(`schedule/user/login`, { userId });
};
