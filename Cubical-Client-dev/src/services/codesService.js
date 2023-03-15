import { createAxiosInstance } from "../config/axiosInstance";
const axiosInstance = createAxiosInstance(process.env.REACT_APP_SERVICE_API, "/api/");

export const getActiveAvailableStationsByComplex = (complexId) => {
  return axiosInstance.get(`station/activeAvailableStationsTypes`, { params: { complexId } });
};

export const getComplexes = () => {
  return axiosInstance.get(`complex/complexCodes`);
};

export const getOrganizations = () => {
  return axiosInstance.get(`organization/organizationCodes`);
};
