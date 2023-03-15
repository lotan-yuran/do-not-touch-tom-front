import history from "./history";
import { Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { useMsal } from "@Context/msalContext";
import { Loader } from "../stories/Loader/Loader";
import { checkUser } from "@Services/authenticationService";
import { useAsyncThrowError } from "@Hooks/useAsyncThrowError";

export const ProtectedRoute = ({ isProtected, children, ...props }) => {
  const { user, saveComplexId } = useMsal();
  const { throwError } = useAsyncThrowError();

  const [isAuthorized, setIsAuthorized] = useState(null);

  useEffect(() => {
    (async () => {
      if (isProtected) {
        try {
          const { data } = await checkUser(user?.id);
          saveComplexId(data.complexId);
          setIsAuthorized(true);
        } catch (e) {
          if (e.response.status === 401) {
            setIsAuthorized(false);
          } else {
            throwError(e);
          }
        }
      }
    })();
  }, []);

  return (
    <Route
      {...props}
      render={() => {
        if (isProtected) {
          if (isAuthorized === false) {
            history.push("/");
          } else if (isAuthorized) {
            return children;
          } else {
            return <Loader />;
          }
        } else {
          return children;
        }
      }}
    />
  );
};
