import { createAxiosInstance } from "../config/axiosInstance";
import moment from "moment";
const axiosInstance = createAxiosInstance(process.env.REACT_APP_SERVICE_API, "/api/schedule/complex");

export default {
  getComplexData: async complexId => {
    const { data } = await axiosInstance.get(`/getData?complexId=${complexId}`);

    return data;
  },
  updateComplexDisables: async (complexId, deletedDisablesIds, addedDisables) => {
    const addedDatesToUtc = addedDisables.map(disable => {
      return {
        ...disable,
        start_date: typeof disable.start_date === "object" ? disable.start_date : moment(disable.start_date),
        end_date: typeof disable.end_date === "object" ? disable.end_date : moment(disable.end_date)
      };
    });
    const { res } = await axiosInstance.put(`/updateComplexDisables`, {
      complexId,
      deletedDisablesIds,
      addedDisables: addedDatesToUtc
    });
    return res;
  },
  updateComplexManagers: async (complexId, deletedManagersIds, addedManagers) => {
    const { res } = await axiosInstance.put(`/updateComplexManagers`, {
      complexId,
      deletedManagersIds,
      addedManagers
    });
    return res;
  }
};
