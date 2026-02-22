import { api } from "./axios";

const routeBase = "api/question";

export const createQuestion = async (label: string, idQcm: string) => {
  const res = await api.post(`${routeBase}`, {
    label: label,
    qcm_id: idQcm,
  });
  return res.data;
};

export const updateQuestion = async (id: string, label: string) => {
  const res = await api.put(`${routeBase}/${id}`, {
    label: label,
  });
  return res.data;
};

export const getQuestionById = async (id: string) => {
  const res = await api.get(`${routeBase}/${id}`);
  return res.data;
};

export const deleteQuestion = async (id: string) => {
  const res = await api.delete(`${routeBase}/${id}`);
  return res.data;
};
