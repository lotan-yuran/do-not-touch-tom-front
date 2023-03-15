import { hot } from "react-hot-loader/root";

import MuiTheme from "./MuiTheme";
import style from "./app.module.scss";
import history from "./router/history";
import { Router } from "react-router-dom";
import RouteManager from "./router/RouteManager";
import { PromptPWA } from "./PWA/PromptPWA/PromptPWA";
import { QueryClient, QueryClientProvider } from "react-query";
import TelemetryProvider from "./applicationInsights/TelemetryProvider";
import AuthenticationProvider from "./authentication/AuthenticationProvider";

const queryClient = new QueryClient();

const App = () => {
  return (
    <Router history={history}>
      <QueryClientProvider client={queryClient}>
        <TelemetryProvider instrumentationKey={process.env.REACT_APP_APPINSIGHTS_KEY}>
          <MuiTheme>
            <AuthenticationProvider>
              <div className={style["app"]}>
                <PromptPWA />
                <RouteManager />
              </div>
            </AuthenticationProvider>
          </MuiTheme>
        </TelemetryProvider>
      </QueryClientProvider>
    </Router>
  );
};

export default hot(App);
