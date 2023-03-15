import moment from "moment";

// Constants
import { replaceByInput } from "../constants/newAppointment";

// Config
import { createAxiosInstance } from "../config/axiosInstance";

const axiosInstance = createAxiosInstance(process.env.REACT_APP_SERVICE_API, "/api/");

// appointment
export const getActiveAppointmentsAdmin = async (day, userId, complexId) => {
  return axiosInstance.post(`schedule/appointment/getActiveAppointments`, {
    userId,
    complexId,
    day: moment(day).format("YYYY-MM-DD")
  });
};

export const getDisableStationsTimes = async ({ date, complexId }) => {
  return axiosInstance.post(`schedule/appointment/getComplexUnavailableHours`, {
    complexId,
    day: moment(date).format("YYYY-MM-DD")
  });
};

export const getUnavailableHoursAdmin = async (
  complexId,
  day,
  stationId,
  stationTypeId,
  appointmentUserId
) => {
  return axiosInstance.post(`schedule/appointment/getUnavailableHours`, {
    complexId,
    stationId,
    stationTypeId,
    appointmentUserId,
    day: moment(day).format("YYYY-MM-DD")
  });
};

export const cancelAppointmentAdmin = appointmentId => {
  return axiosInstance.post(`schedule/appointment/setAppointmentCancelledAdmin`, {
    appointmentId
  });
};

// complex
export const getScheduleAdmin = complexId => {
  return axiosInstance.get(`schedule/complex/getSchedule`, { params: { complexId } });
};

// station
export const getAllActiveStationsAdmin = async (userId, complexId) => {
  return axiosInstance.get(`schedule/station/getAllStations`, { params: { userId, complexId } });
};

export const setStationActivityAdmin = async (stationId, newDisables, deletedDisables) => {
  const formattedDisables = newDisables.map(disable => {
    return {
      start_date: typeof disable.start_date === "object" ? disable.start_date : moment(disable.start_date),
      end_date: typeof disable.end_date === "object" ? disable.end_date : moment(disable.end_date),
      title: disable.title
    };
  });
  return axiosInstance.post(`schedule/station/setStationActivity`, {
    newDisables: formattedDisables,
    deletedDisables: deletedDisables.map(({ id }) => id),
    stationId
  });
};

export const getAvailableStationsByComplexAdmin = complexId => {
  if (!complexId) return axiosInstance.get(`schedule/station/availableStationsTypes`);

  return axiosInstance.get(`schedule/station/availableStationsTypes`, { params: { complexId } });
};

export const getActiveAvailableStationsTypesAdmin = () => {
  return axiosInstance.get(`schedule/station/activeAvailableStationsTypes`);
};

export const getActiveStationsByStationTypeAdmin = (stationTypeId, complexId) => {
  return axiosInstance.get(`schedule/station/stationsByType`, { params: { stationTypeId, complexId } });
};
