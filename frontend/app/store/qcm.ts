import { create } from "zustand";
import { deleteQcm, getAllQcm } from "~/api/qcm";

export type Qcm = {
  id: number;
  label: string;
  topic: string;
  author: string;
  question_count: number;
  assignment_count: number;
};

type QcmStore = {
  qcms: Qcm[];
  loading: boolean;
  error: string | null;

  fetchQcms: () => Promise<void>;
  addQcm: (qcm: Qcm) => void;
  updateQcm: (qcm: Qcm) => void;
  removeQcm: (id: number) => void;
};

export const useQcmStore = create<QcmStore>((set) => ({
  qcms: [],
  loading: false,
  error: null,

  fetchQcms: async () => {
    set({ loading: true, error: null });

    try {
      const res = await getAllQcm();
      const formatted = res.map((item: any) => transformQcm(item));
      set({ qcms: formatted });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      set({ error: message });
    } finally {
      set({ loading: false });
    }
  },

  addQcm: (qcm) => set((state) => ({ qcms: [...state.qcms, qcm] })),

  updateQcm: (qcm) =>
    set((state) => ({
      qcms: state.qcms.map((q) => (q.id === qcm.id ? qcm : q)),
    })),

  removeQcm: async (id) => {
    set({ loading: true, error: null });
    try {
      await deleteQcm(id);
      set((state) => ({
        qcms: state.qcms.filter((q) => q.id !== id),
      }));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      set({ error: message });
    } finally {
      set({ loading: false });
    }
  },
}));

export function transformQcm(apiQcm: any) {
  return {
    id: apiQcm.id,
    label: apiQcm.label,
    topic: apiQcm.topic?.label ?? "Unknown",
    author:
      apiQcm.author?.firstname && apiQcm.author?.lastname
        ? `${apiQcm.author.firstname} ${apiQcm.author.lastname}`
        : "Unknown",
    question_count: apiQcm.questions?.length ?? 0,
    assignment_count: apiQcm.results?.length ?? 0,
  };
}
