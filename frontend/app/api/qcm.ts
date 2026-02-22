import { api } from "./axios";

const routeBase = "api/qcm";

export type QcmPayload = {
  label: string;
  time_limit: number;
  author_id: number;
  topic_id: number;
};

export const createQcm = async (payload: QcmPayload) => {
  const res = await api.post(`${routeBase}`, payload);
  return res.data;
};

export const getAllQcm = async () => {
  const res = await api.get(`${routeBase}`);
  return res.data;
};

export const getQcmById = async (id: number) => {
  const res = await api.get(`${routeBase}/${id}`);
  return res.data;
};

export const updateQcm = async (id: number, payload: Partial<QcmPayload>) => {
  const res = await api.put(`${routeBase}/${id}`, payload);
  return res.data;
};

export const deleteQcm = async (id: number) => {
  const res = await api.delete(`${routeBase}/${id}`);
  return res.data;
};
