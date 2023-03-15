// Constants
import { replaceByInput } from "../constants/newAppointment";
import { createAxiosInstance } from "../config/axiosInstance";

const axiosInstance = createAxiosInstance(process.env.REACT_APP_SERVICE_API, "/api/");

export const getScheduleSettings = complexId => {
  return axiosInstance.get(`complex/getSchedule`, { params: { complexId } });
};

export const getAssignIntervalByStation = stationTypeId => {
  return axiosInstance.get(`station/assignInterval`, { params: { stationTypeId } });
};

export const getFullCapacityHoursByStation = (appointmentUserId, day, stationTypeId, complexId) => {
  return axiosInstance.post(`appointment/getUnavailableHours`, {
    day,
    complexId,
    stationTypeId,
    appointmentUserId
  });
};

export const createAppointment = (userId, datetimeList, stationTypeId, complexId, userInfo, reason) => {
  Object.keys(replaceByInput).forEach(key => {
    userInfo = { ...userInfo, [key]: userInfo[key].replace(replaceByInput[key], "") };
  });
  return axiosInstance.post(`appointment/createAppointment`, {
    userId,
    userInfo,
    complexId,
    startDatetime: datetimeList,
    stationTypeId,
    reason
  });
};

export const createAppointmentAdminNew = (
  userId,
  datetimeList,
  stationId,
  complexId,
  userInfo,
  stationTypeId
) => {
  Object.keys(replaceByInput).forEach(key => {
    userInfo = { ...userInfo, [key]: userInfo[key].replace(replaceByInput[key], "") };
  });
  return axiosInstance.post(`appointment/createAppointment`, {
    userId,
    userInfo,
    complexId,
    startDatetime: datetimeList,
    stationId,
    stationTypeId
  });
};

export const getUserInfo = appointmentUserId => {
  return axiosInstance.post(`user/getUserInfo`, { appointmentUserId });
};

export const getServiceType = async userId => {
  return await axiosInstance.post(`user/getServiceType`, { userId });
};
