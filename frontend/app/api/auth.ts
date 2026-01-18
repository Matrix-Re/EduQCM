import { api } from "./axios";

const routeBase = "api/auth";

export const login = async (username: string, password: string) => {
  const res = await api.post(`${routeBase}/login`, {
    username: username,
    password: password,
  });
  return res.data;
};

export const register = async (
  lastname: string,
  firstname: string,
  username: string,
  password: string,
  role: string
) => {
  const res = await api.post(`${routeBase}/register`, {
    lastname: lastname,
    firstname: firstname,
    username: username,
    password: password,
    role: role,
  });
  return res.data;
};

export const getMe = async () => {
  const res = await api.get(`${routeBase}/currentSession`);
  return res.data;
};
