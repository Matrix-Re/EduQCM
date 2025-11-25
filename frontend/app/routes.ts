import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("pages/home.tsx"),
    route("register", "pages/register.tsx"),
    route("login", "pages/login.tsx"),
    route("dashboard", "pages/dashboard.tsx"),
    route("quiz_management", "pages/quizManagement.tsx"),
    route("quiz_management/qcm/create", "pages/qcm/create.tsx"),
    route("quiz_management/qcm/:id/edit", "pages/qcm/edit.tsx"),
    route("quiz_management/qcm/:id", "pages/qcm/view.tsx"),
] satisfies RouteConfig;
