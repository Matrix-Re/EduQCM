import { create } from "zustand";

type MenuItem = {
    title: string;
    icon: string;
    url: string;
    isActive?: boolean;
};

type MenuSection = {
    title: string;
    items: MenuItem[];
};

type MenuState = {
    navMain: MenuSection[];

    setMenu: (menu: MenuSection[]) => void;
    setActive: (sectionIdx: number, itemIdx: number) => void;
};

export const teacherMenu = [
    {
        title: "Teacher",
        items: [
            { title: "Dashboard", icon: "home.svg", url: "/dashboard", isActive: false },
            { title: "QCMs Management", icon: "quiz.png", url: "/quiz_management", isActive: false },
            { title: "Users Management", icon: "user.png", url: "/users", isActive: false },
            { title: "Results", icon: "result.png", url: "/results", isActive: false },
            { title: "Groupes Management", icon: "group.png", url: "/groups", isActive: false },
            { title: "Settings", icon: "settings.svg", url: "/settings", isActive: false },
        ]
    }
];

export const studentMenu = [
    {
        title: "Student",
        items: [
            { title: "Dashboard", icon: "home.svg", url: "/dashboard", isActive: false },
            { title: "QCM assigned", icon: "quiz.png", url: "/assigned", isActive: true },
            { title: "Results", icon: "result.png", url: "/results", isActive: false },
            { title: "Settings", icon: "settings.svg", url: "/settings", isActive: false },
        ]
    }
];


export const useMenuStore = create<MenuState>((set) => ({
    navMain: [],

    // Permet d'initialiser le menu (depuis data)
    setMenu: (menu) => set({ navMain: menu }),

    // Active un item selon section + index
    setActive: (sectionIdx, itemIdx) =>
        set((state) => ({
            navMain: state.navMain.map((sec, sIdx) => ({
                ...sec,
                items: sec.items.map((it, iIdx) => ({
                    ...it,
                    isActive: sIdx === sectionIdx && iIdx === itemIdx,
                })),
            })),
        })),
}));
