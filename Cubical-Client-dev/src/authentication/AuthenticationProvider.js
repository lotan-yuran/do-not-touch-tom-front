import { TomLogo } from "../icons";
import LoginPage from "./LoginPage/LoginPage";
import { useStyles } from "./Authentication.style";
import { CodesContextProvider } from "../context/codesContext";
import { msalConfig, loginRequest } from "../config/authConfig";
import { AuthState, MsalProvider } from "../context/msalContext";
import ErrorBoundaryMain from "../providersError/ErrorBoundaryMain";
import { AsyncErrorContextProvider } from "../context/asyncErrorContext";
import { ErrorAsyncProvider } from "../providersError/ErrorAsyncProvider";

const AuthenticationProvider = ({ children }) => {
  const classes = useStyles();

  return (
    <>
      <MsalProvider forceLogin={false} config={msalConfig} request={loginRequest}>
        {authState => {
          if (process.env.REACT_APP_NOT_AUTH === "true") {
            return (
              <ErrorBoundaryMain>
                <AsyncErrorContextProvider>
                  <ErrorAsyncProvider>
                    <CodesContextProvider>{children}</CodesContextProvider>
                  </ErrorAsyncProvider>
                </AsyncErrorContextProvider>
              </ErrorBoundaryMain>
            );
          } else {
            switch (authState) {
              case AuthState.UnAuthenticated:
                return <LoginPage />;

              case AuthState.InProgress:
                return (
                  <div className={classes.root}>
                    <TomLogo className={classes.logo} />
                  </div>
                );

              case AuthState.Authenticated:
                return (
                  <ErrorBoundaryMain>
                    <AsyncErrorContextProvider>
                      <ErrorAsyncProvider>
                        <CodesContextProvider>{children}</CodesContextProvider>
                      </ErrorAsyncProvider>
                    </AsyncErrorContextProvider>
                  </ErrorBoundaryMain>
                );
            }
          }
        }}
      </MsalProvider>
    </>
  );
};

export default AuthenticationProvider;
