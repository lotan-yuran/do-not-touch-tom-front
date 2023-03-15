import { createAxiosInstance } from "../config/axiosInstance";
const axiosInstance = createAxiosInstance(process.env.REACT_APP_SERVICE_API, "/api/");

export const getUserAppointments = userId => {
  return axiosInstance.post(`appointment/getUserAppointments`, { userId } );
};

export const cancelAppointmentUser = (appointmentId, userId) => {
  return axiosInstance.post(`appointment/setAppointmentCancelledUser`, {
    userId,
    appointmentId
  });
};
