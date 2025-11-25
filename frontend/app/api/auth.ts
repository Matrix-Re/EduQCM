import { api } from "./axios";

export const login = async (username: string, password: string) => {
    const res = await api.post("/auth/login", {
        "username": username,
        "password": password,
    });
    return res.data;
};

export const register = async (lastname: string, firstname: string,username: string, password: string, role: string) => {
    const res = await api.post("/auth/register", {
        "lastName": lastname,
        "firstName": firstname,
        "username": username,
        "password": password,
        "role": role,
    });
    return res.data;
}

export const getMe = async () => {
    const res = await api.get("/auth/currentSession");
    return res.data;
};
