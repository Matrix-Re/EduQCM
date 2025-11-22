import { create } from "zustand";

type MenuSection = {
    title: string;
    icon: string;
    url: string;
    isActive?: boolean;
};

type MenuState = {
    navMain: MenuSection[];

    setMenu: (menu: MenuSection[]) => void;
    setActive: (url: string) => void;
};

export const teacherMenu = [
    { title: "Dashboard", icon: "home.svg", url: "/dashboard", isActive: true },
    { title: "QCMs Management", icon: "quiz.png", url: "/quiz_management", isActive: false },
    { title: "Users Management", icon: "user.png", url: "/users", isActive: false },
    { title: "Results", icon: "result.png", url: "/results", isActive: false },
    { title: "Groupes Management", icon: "group.png", url: "/groups", isActive: false },
    { title: "Settings", icon: "settings.svg", url: "/settings", isActive: false },
];

export const studentMenu = [
    { title: "Dashboard", icon: "home.svg", url: "/dashboard", isActive: true },
    { title: "QCM assigned", icon: "quiz.png", url: "/assigned", isActive: false },
    { title: "Results", icon: "result.png", url: "/results", isActive: false },
    { title: "Settings", icon: "settings.svg", url: "/settings", isActive: false },
];


export const useMenuStore = create<MenuState>((set, get) => ({
    navMain: [],
    active: null,

    // Permet d'initialiser le menu (depuis data)
    setMenu: (menu) => set({ navMain: menu }),

    setActive: (url: string) => set((state) => ({
        navMain: state.navMain.map((item) => ({
            ...item,
            isActive: item.url === url
        }))
    })),


}));
