import { create } from "zustand";

type Auth = {
    userId: number;
    username: string;
    firstname: string;
    lastname: string;
    role: string;
};

type AuthStore = {
    auth: Auth | null;
    token: string | null;
    setAuth: (Auth: Auth, token: string) => void;
    logout: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
    auth: null,
    token: null,

    setAuth: (auth, token) => {
        localStorage.setItem("token", token);
        set({ auth, token });
    },

    logout: () => {
        localStorage.removeItem("token");
        set({ auth: null, token: null });
    },
}));
