import { useWritingLog } from "../hooks/useWritingLog";
import { ENVIRONMENTS } from "../constants/environments";
import { createContext, useState, useContext } from "react";

const AsyncErrorContext = createContext({});
export const useAsyncError = () => useContext(AsyncErrorContext);

export const AsyncErrorContextProvider = ({ children }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [messageDialog, seMessageDialog] = useState(null);
  const [functionAfterOKDialog, onAfterOKDialog] = useState(null);
  const [functionAfterCloseDialog, onAfterCloseDialog] = useState(null);

  const { customTrackException } = useWritingLog();

  const throwError = e => {
    setOpenDialog(true);
    seMessageDialog(e.response?.data?.message?.response?.message);

    if (process.env.NODE_ENV !== ENVIRONMENTS.PRODUCTION || process.env.REACT_APP_DEBUG === "true") {
      console.log(e);
    }

    customTrackException(e);
  };

  const onClose = () => {
    if (typeof functionAfterCloseDialog === "function") {
      functionAfterCloseDialog();
    }
    setOpenDialog(false);
    seMessageDialog(null);
  };

  const onOK = () => {
    if (typeof functionAfterOKDialog === "function") {
      functionAfterOKDialog();
    }
    setOpenDialog(false);
    seMessageDialog(null);
  };

  return (
    <AsyncErrorContext.Provider
      value={{ openDialog, messageDialog, throwError, onClose, onOK, onAfterCloseDialog, onAfterOKDialog }}
    >
      {children}
    </AsyncErrorContext.Provider>
  );
};
