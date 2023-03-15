// Context
import { useAsyncError } from "../context/asyncErrorContext";

// Smart components
import { DialogError } from "../smartComponents/DialogError/DialogError";

export const ErrorAsyncProvider = ({ children }) => {
  const { onClose, openDialog, messageDialog, onOK } = useAsyncError();

  return (
    <>
      {children}
      <DialogError open={openDialog} messageDialog={messageDialog} onClose={onClose} onOK={onOK} />
    </>
  );
};
