import { mapQuestion } from "./question.mapper.js";

const baseMapQcm = (qcm, { withQuestions = false } = {}) => ({
  id: qcm.id,
  label: qcm.label,
  time_limit: qcm.time_limit,

  ...(withQuestions && {
    questions: (qcm.questions ?? []).map(mapQuestion),
  }),

  topic: {
    id: qcm.topic.id,
    label: qcm.topic.label,
  },

  author: {
    id: qcm.author.user.id,
    firstname: qcm.author.user.firstname,
    lastname: qcm.author.user.lastname,
    username: qcm.author.user.username,
  },

  created_at: qcm.created_at,
  updated_at: qcm.updated_at,
});

export const mapQcm = (qcm) => baseMapQcm(qcm);

export const mapQcmWithQuestions = (qcm) =>
  baseMapQcm(qcm, { withQuestions: true });

export const mapQcmLight = (qcm) => {
  return {
    id: qcm.id,
    label: qcm.label,
  };
};
