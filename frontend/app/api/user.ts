import { api } from "./axios";

const routeBase = "api/users";

export type UpdateUserPayload = {
  lastname?: string;
  firstname?: string;
  username?: string;
};

export const updateUser = async (id: number, payload: UpdateUserPayload) => {
  const res = await api.put(`${routeBase}/${id}`, payload);
  return res.data;
};

export const deleteUser = async (id: number) => {
  const res = await api.delete(`${routeBase}/${id}`);
  return res.data;
};
