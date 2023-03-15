import { isMobile as isMobileLibrary } from "react-device-detect";

// Constants
import { typesMobile } from "../constants/general";

// Used to detect whether the users browser is an mobile browser
export const useMobile = () => {
  let isMobile = false;
  let isIOS = false;

  if (!isMobileLibrary) {
    for (let mobile of typesMobile) {
      if (~navigator.userAgent.toLowerCase().indexOf(mobile.toLowerCase())) {
        isMobile = true;
      }
    }
  }

  const isInStandaloneMode = "standalone" in window.navigator && window.navigator.standalone;
  if (
    navigator.userAgent.indexOf("Safari") != -1 &&
    navigator.userAgent.indexOf("Chrome") == -1 &&
    !isInStandaloneMode
  ) {
    isIOS = true;
  }

  return { isMobile, isIOS };
};
