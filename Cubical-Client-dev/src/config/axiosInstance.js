import axios from "axios";
import { getMsalProps } from "./authConfig";
// import { customTrackException } from "../utils/logs";

const injectTokenInRequest = () => async config => {
  try {
    let msalProps;
    if (process.env.REACT_APP_NOT_AUTH === "true") {
      msalProps = { idToken: process.env.REACT_APP_TOKEN };
    } else {
      msalProps = await getMsalProps();
    }
    if (msalProps.idToken) {
      config.headers = {
        Authorization: `Bearer ${msalProps.idToken}`,
        "Content-Type": "application/json"
      };
    } else {
      console.error("failed to get access token");
    }
  } catch (err) {
    console.error(err);
  }
  return config;
};

export const createAxiosInstance = (service, prefix) => {
  const instance = axios.create({
    baseURL: service + prefix
  });
  const injectTokenFunc = injectTokenInRequest(service);
  instance.interceptors.request.use(injectTokenFunc);

  return instance;
};
