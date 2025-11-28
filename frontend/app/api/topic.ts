import { api } from "./axios";

export const createTopic = async (label: string) => {
    const res = await api.post("/topic", { description: label });
    return res.data;
}

export const updateTopic = async (id: number, label: string) => {
    const res = await api.put(`/topic/${id}`, { description: label });
    return res.data;
}

export const deleteTopic = async (id: number) => {
    const res = await api.delete(`/topic/${id}`);
    return res.data;
}

export const getAllTopics = async () => {
    const res = await api.get("/topic");
    return res.data;
}
