import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "~/store/auth";
import LoadingPage from "../shared/loading-page";
import ErrorPage from "../shared/error-page";
import { APP_ROUTES } from "~/constants/appRoutes";

export default function ProtectedLayout() {
  const token = useAuthStore((s) => s.token);
  const hydrated = useAuthStore((s) => s.hydrated);
  const error = useAuthStore((s) => s.error);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (error) return;
    if (!hydrated) return;
    if (!token) {
      navigate(APP_ROUTES.LOGIN, {
        replace: true,
        state: { from: location.pathname },
      });
    }
  }, [token, hydrated, navigate, location]);

  return token && hydrated === true ? (
    <Outlet />
  ) : error ? (
    <ErrorPage
      title="Server unavailable"
      subtitle="We couldn’t load your account right now."
    />
  ) : (
    <LoadingPage />
  );
}
