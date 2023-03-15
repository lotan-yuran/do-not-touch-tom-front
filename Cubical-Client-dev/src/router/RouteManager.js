import { routes } from "./routes";
import { ProtectedRoute } from "./ProtectedRoute";
import { Switch, Redirect } from "react-router-dom";

const RouteManager = () => (
  <>
    <Switch>
      {routes.map((route, index) => {
        return (
          <ProtectedRoute key={index} exact={route.exact} path={route.path} isProtected={route.protected}>
            {route.component}
          </ProtectedRoute>
        );
      })}
      <Redirect from="*" to="/" />
    </Switch>
  </>
);

export default RouteManager;
