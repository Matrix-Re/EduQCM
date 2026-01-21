import { create } from "zustand";
import { getCurrentSession } from "~/api/auth";

export type Auth = {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  role: string;
};

type AuthStore = {
  auth: Auth | null;
  token: string | null;
  hydrated: boolean;
  error?: string;

  setAuth: (auth: Auth, token: string) => void;
  updateAuth: (auth: Auth) => void;
  logout: () => void;
  hydrate: () => void;
};

const isBrowser = () => typeof window !== "undefined";

export const useAuthStore = create<AuthStore>((set) => ({
  auth: null,
  token: null,
  hydrated: false,
  error: undefined,
  setAuth: (auth, token) => {
    localStorage.setItem("token", token);
    set({ auth, token });
  },

  updateAuth: (auth) => {
    set((state) => ({ auth: { ...state.auth, ...auth } as Auth }));
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ auth: null, token: null });
  },

  hydrate: async () => {
    if (!isBrowser()) return;
    const token = localStorage.getItem("token");
    if (!token) {
      set({ hydrated: true });
      return;
    }
    set({ token, hydrated: false, error: undefined });

    // Get user info from token (if exists)
    if (token) {
      try {
        const auth = await getCurrentSession();
        set({ auth, hydrated: true });
      } catch (e) {
        set({ hydrated: true, error: String(e) });
        console.error("Failed to hydrate auth store:", e);
      }
    }
  },
}));
