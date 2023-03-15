import { createAxiosInstance } from "../config/axiosInstance";

const axiosInstance = createAxiosInstance(process.env.REACT_APP_SERVICE_API, "/api/disableStation");

export default {
  getStationDisableData: async stationId => {
    const { data } = await axiosInstance.get(`/${stationId}`);
    return data;
  }
};
