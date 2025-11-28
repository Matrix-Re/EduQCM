import { create } from "zustand";
import {getAllTopics} from "~/api/topic";

export type Topic = {
    id: number;
    label: string;
};

type TopicStore = {
    topics: Topic[];
    loading: boolean;
    error: string | null;
    mode: string;
    currentTopic: Topic | null;

    // Actions
    setMode: (mode: string) => void;
    setCurrentTopic: (topic: Topic | null) => void;
    fetchTopics: () => Promise<void>;
    addTopic: (topic: Topic) => void;
    updateTopic: (updatedTopic: Topic) => void;
    removeTopic: (topicId: number) => void;
};

export const useTopicStore = create<TopicStore>((set) => ({
    topics: [],
    loading: false,
    error: null,
    mode: '',
    currentTopic: null,

    setMode: (mode) => set({ mode }),
    setCurrentTopic: (topic) => set({ currentTopic: topic }),

    fetchTopics: async () => {
        set({ loading: true, error: null });

        try {
            const res = await getAllTopics();
            const formatted = res.map((item: any) => transformTopic(item));
            set({ topics: formatted });
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            set({ error: message });
        } finally {
            set({ loading: false });
        }
    },

    addTopic: (apiTopic: any) => {
        const topic = transformTopic(apiTopic);
        set((state: TopicStore) => ({
            topics: [...state.topics, topic],
        }));
    },

    updateTopic: (updatedTopic: Topic) => {
        const newTopic = transformTopic(updatedTopic);

        set((state: TopicStore) => ({
            topics: state.topics.map((t: Topic) =>
                t.id === newTopic.id ? newTopic : t
            ),
        }));
    },

    removeTopic: (topicId: number) => {
        set((state: TopicStore) => ({
            topics: state.topics.filter((topic: Topic) => topic.id !== topicId),
        }));
    },
}));

export function transformTopic(apiTopic: any) {
    return {
        id: apiTopic.TopicId,
        label: apiTopic.description,
    };
}
