import { api } from "./axios";

export const createQuestion = async (label: string, time : number, idQcm: string) => {
    const res = await api.post("/question", {
        "questionLabel": label,
        "questionTime": 0,
        "qcmId": idQcm
    });
    return res.data;
};

export const updateQuestion = async (id: string, label: string, time : number) => {
    const res = await api.put(`/question/${id}`, {
        "questionLabel": label,
        "questionTime": time
    });
    return res.data;
}

export const deleteQuestion = async (id: string) => {
    const res = await api.delete(`/question/${id}`);
    return res.data;
}