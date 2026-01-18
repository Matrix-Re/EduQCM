import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "~/store/auth";

export default function ProtectedLayout() {
  const token = useAuthStore((s) => s.token);
  const hydrated = useAuthStore((s) => s.hydrated);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!hydrated) return;
    if (!token) {
      navigate("/login", { replace: true, state: { from: location.pathname } });
    }
  }, [token, hydrated, navigate, location.pathname]);

  return <Outlet />;
}
