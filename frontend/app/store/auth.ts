import { create } from "zustand";

export type Auth = {
  userId: number;
  username: string;
  firstname: string;
  lastname: string;
  role: string;
};

type AuthStore = {
  auth: Auth | null;
  token: string | null;
  hydrated: boolean;

  setAuth: (Auth: Auth, token: string) => void;
  logout: () => void;
  hydrate: () => void;
};

const isBrowser = () => typeof window !== "undefined";

export const useAuthStore = create<AuthStore>((set) => ({
  auth: null,
  token: null,
  hydrated: false,
  setAuth: (auth, token) => {
    localStorage.setItem("token", token);
    set({ auth, token });
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ auth: null, token: null });
  },

  hydrate: () => {
    if (!isBrowser()) return;
    const token = localStorage.getItem("token");
    set({ token, hydrated: true });
  },
}));
