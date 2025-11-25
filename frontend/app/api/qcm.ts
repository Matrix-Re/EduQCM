import { api } from "./axios";

export type QcmPayload = {
    qcmLabel: string;
    authorId: number;
    topicId: number;
};

export type AssignPayload = {
    studentId: number;
};

export const createQcm = async (payload: QcmPayload) => {
    const res = await api.post("/qcm", payload);
    return res.data;
};

export const getAllQcm = async () => {
    const res = await api.get("/qcm");
    return res.data;
};

export const getQcmById = async (id: number) => {
    const res = await api.get(`/qcm/${id}`);
    return res.data;
};

export const updateQcm = async (id: number, payload: Partial<QcmPayload>) => {
    const res = await api.put(`/qcm/${id}`, payload);
    return res.data;
};

export const deleteQcm = async (id: number) => {
    const res = await api.delete(`/qcm/${id}`);
    return res.data;
};

