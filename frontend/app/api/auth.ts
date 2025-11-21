import { api } from "./axios";

export const login = async (username: string, password: string) => {
    const res = await api.post("/auth/login", {
        "username": username,
        "password": password,
    });
    console.log(res)
    return res.data;
};

export const getMe = async () => {
    const res = await api.get("/auth/me");
    return res.data;
};
