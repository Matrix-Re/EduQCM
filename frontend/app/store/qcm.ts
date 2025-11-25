import { create } from "zustand";
import {deleteQcm, getAllQcm} from "~/api/qcm";

export type Qcm = {
    id: number;
    label: string;
    theme: string;
    author: string;
    questionCount: number;
    assignmentCount: number;
};

type QcmStore = {
    qcms: Qcm[];
    loading: boolean;
    error: string | null;

    // Actions
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

    addQcm: (qcm) =>
        set((state) => ({ qcms: [...state.qcms, qcm] })),

    updateQcm: (qcm) =>
        set((state) => ({
            qcms: state.qcms.map((q) => (q.id === qcm.id ? qcm : q)),
        })),

    removeQcm: async(id) => {
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
    }

}));

export function transformQcm(apiQcm: any) {
    return {
        id: apiQcm.QCMId,
        label: apiQcm.QCMLabel,
        topic: apiQcm.topic?.description ?? "Unknown",
        author: apiQcm.author?.user
            ? `${apiQcm.author.user.firstName} ${apiQcm.author.user.lastName}`
            : "Unknown",
        questionCount: apiQcm.questions?.length ?? 0,
        assignmentCount: apiQcm.results?.length ?? 0,
    };
}
