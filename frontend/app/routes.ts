import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("pages/home.tsx"),
  route("/login", "pages/login.tsx"),
  route("/register", "pages/register.tsx"),

  route("/app", "components/protected-layout.tsx", [
    index("pages/app/index.tsx"),
    route("dashboard", "pages/app/dashboard.tsx"),
  ]),
] satisfies RouteConfig;
