import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("pages/home.tsx"),
  route("/login", "pages/login.tsx"),
  route("/register", "pages/register.tsx"),

  route("/app", "components/layout/protected-layout.tsx", [
    index("pages/app/index.tsx"),
    route("dashboard", "pages/app/dashboard.tsx"),
    route("quiz_management", "pages/app/quiz_management/index.tsx"),
    route(
      "quiz_management/qcm/create",
      "pages/app/quiz_management/qcm/create.tsx"
    ),
    route("quiz_management/qcm/:id", "pages/app/quiz_management/qcm/view.tsx"),
    route(
      "quiz_management/qcm/:id/edit",
      "pages/app/quiz_management/qcm/edit.tsx"
    ),

    route("list_qcm", "pages/app/list_qcm/index.tsx"),

    route("settings", "pages/app/settings.tsx"),
  ]),

  route("*", "pages/error.tsx"),
] satisfies RouteConfig;
