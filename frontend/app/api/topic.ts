import { api } from "./axios";

const routeBase = "api/topic";

export const createTopic = async (label: string) => {
  const res = await api.post(`${routeBase}`, { label });
  return res.data;
};

export const updateTopic = async (id: number, label: string) => {
  const res = await api.put(`${routeBase}/${id}`, { label });
  return res.data;
};

export const deleteTopic = async (id: number) => {
  const res = await api.delete(`${routeBase}/${id}`);
  return res.data;
};

export const getAllTopics = async () => {
  const res = await api.get(`${routeBase}`);
  return res.data;
};
