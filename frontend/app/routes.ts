import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("pages/home.tsx"),
    route("register", "pages/register.tsx"),
    route("login", "pages/login.tsx"),
    route("dashboard", "pages/dashboard.tsx"),
    route("quiz_management", "pages/quizManagement.tsx"),
] satisfies RouteConfig;
