import { api } from "./axios";

const routeBase = "api/proposal";

export const createProposal = async (
  label: string,
  questionId: number,
  isCorrect: boolean
) => {
  const res = await api.post(routeBase, {
    label: label,
    question_id: questionId,
    is_correct: isCorrect,
  });
  return res.data;
};

export const updateProposal = async (
  id: number,
  label: string,
  isCorrect: boolean
) => {
  const res = await api.put(`${routeBase}/${id}`, {
    label: label,
    is_correct: isCorrect,
  });
  return res.data;
};

export const deleteProposal = async (id: number) => {
  const res = await api.delete(`${routeBase}/${id}`);
  return res.data;
};
