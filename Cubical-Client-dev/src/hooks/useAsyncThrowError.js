import { useState } from "react";

// Smart components
import { useAsyncError } from "../context/asyncErrorContext";

export function useAsyncThrowError(errorLocation) {
  const [, setError] = useState(false);
  const asyncErrorContext = useAsyncError();

  const throwError = e => {
    if (process.env.NODE_ENV !== ENVIRONMENTS.PRODUCTION || process.env.REACT_APP_DEBUG === "true") {
      console.log(e);
    }

    setError(() => {
      throw e;
    });
  };

  switch (errorLocation) {
    case "general":
      return { throwError };
    case "dialog":
      return asyncErrorContext;
    default:
      return { throwError };
  }
}
