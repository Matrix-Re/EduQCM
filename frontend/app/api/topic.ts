import { api } from "./axios";

export const getAllTopics = async () => {
    const res = await api.get("/topic");
    return res.data;
}