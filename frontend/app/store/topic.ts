import { toast } from "sonner";
import { create } from "zustand";
import { getAllTopics } from "~/api/topic";

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
  mode: "",
  currentTopic: null,

  setMode: (mode) => set({ mode }),
  setCurrentTopic: (topic) => set({ currentTopic: topic }),

  fetchTopics: async () => {
    set({ loading: true, error: null });

    try {
      const res = await getAllTopics();
      set({ topics: res });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      set({ error: message });
      toast.error("Error fetching topics: " + message);
    } finally {
      set({ loading: false });
    }
  },

  addTopic: (apiTopic: any) => {
    const topic = apiTopic;
    set((state: TopicStore) => ({
      topics: [...state.topics, topic],
    }));
  },

  updateTopic: (updatedTopic: Topic) => {
    const newTopic = updatedTopic;

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
