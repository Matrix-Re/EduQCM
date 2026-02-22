import { Navigate } from "react-router-dom";
import { APP_ROUTES } from "~/constants/appRoutes";

export default function AppIndex() {
  return <Navigate to={APP_ROUTES.APP.DASHBOARD} replace />;
}
