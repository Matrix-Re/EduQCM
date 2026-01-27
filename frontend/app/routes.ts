import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("pages/home.tsx"),
  route("/login", "pages/login.tsx"),
  route("/register", "pages/register.tsx"),

  route("/app", "components/layout/protected-layout.tsx", [
    index("pages/app/index.tsx"),
    route("dashboard", "pages/app/dashboard.tsx"),
    route("quiz_management", "pages/app/qcm-management.tsx"),
    route("settings", "pages/app/settings.tsx"),
  ]),
] satisfies RouteConfig;
