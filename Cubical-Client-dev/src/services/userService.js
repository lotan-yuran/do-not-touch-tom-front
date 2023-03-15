import { createAxiosInstance } from "../config/axiosInstance";
const axiosInstance = createAxiosInstance(process.env.REACT_APP_SERVICE_API, "/api/");

export const getUserPhone = userId => {
  return axiosInstance.post(`user/getUserPhone`, { userId });
};

export const getUsersFullName = userIdArr => {
  return axiosInstance.post(`user/getUsersNames`, { users: userIdArr });
};
