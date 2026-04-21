import { index } from "@react-router/dev/routes";

export const APP_ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",

  APP: {
    INDEX: "/app",
    DASHBOARD: "/app/dashboard",
    SETTINGS: "/app/settings",

    // teacher routes
    QUIZ_MANAGEMENT: {
      INDEX: "/app/quiz_management",
      CREATE: "/app/quiz_management/qcm/create",
      EDIT: (id: number) => `/app/quiz_management/qcm/${id}/edit`,
      VIEW: (id: number) => `/app/quiz_management/qcm/${id}`,
    },

    // student routes
    QUIZ_LIST: "/app/list_qcm",
  },
} as const;
