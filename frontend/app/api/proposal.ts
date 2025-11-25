import { api } from "./axios";

export const createProposal = async (label: string, questionId : number, isCorrect: boolean) => {
    const res = await api.post("/proposal", {
        "proposalLabel": label,
        "questionId": questionId,
        "isCorrect": isCorrect
    });
    return res.data;
};

export const updateProposal = async (id: number, label: string, isCorrect: boolean) => {
    const res = await api.put(`/proposal/${id}`, {
        "proposalLabel": label,
        "isCorrect": isCorrect
    });
    return res.data;
}

export const deleteProposal = async (id: number) => {
    const res = await api.delete(`/proposal/${id}`);
    return res.data;
}