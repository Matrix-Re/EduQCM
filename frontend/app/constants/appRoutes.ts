export const APP_ROUTES = {
    LOGIN: "/login",
    DASHBOARD: "/dashboard",

    QCM: {
        LIST: "/quiz_management",
        CREATE: "/quiz_management/qcm/create",
        EDIT: (id: number) => `/quiz_management/qcm/${id}/edit`,
        VIEW: (id: number) => `/quiz_management/qcm/${id}`,
    },

} as const;
