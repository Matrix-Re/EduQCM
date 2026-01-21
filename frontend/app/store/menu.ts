import { create } from "zustand";
import { assetUrl } from "~/utils/url";

type MenuSection = {
  titleKey: string;
  iconLight: string;
  iconDark: string;
  url: string;
  isActive?: boolean;
};

type MenuState = {
  navMain: MenuSection[];

  setMenu: (menu: MenuSection[]) => void;
  setActive: (url: string) => void;
};

export const teacherMenu = [
  {
    titleKey: "menu.dashboard",
    iconLight: assetUrl("home/light.png"),
    iconDark: assetUrl("home/dark.png"),
    url: "app/dashboard",
    isActive: true,
  },
  {
    titleKey: "menu.qcm_management",
    iconLight: assetUrl("quiz/light.png"),
    iconDark: assetUrl("quiz/dark.png"),
    url: "app/quiz_management",
    isActive: false,
  },
  {
    titleKey: "menu.users_management",
    iconLight: assetUrl("user/light.png"),
    iconDark: assetUrl("user/dark.png"),
    url: "app/users",
    isActive: false,
  },
  {
    titleKey: "menu.results",
    iconLight: assetUrl("result/light.png"),
    iconDark: assetUrl("result/dark.png"),
    url: "app/results",
    isActive: false,
  },
  {
    titleKey: "menu.groups_management",
    iconLight: assetUrl("group/light.png"),
    iconDark: assetUrl("group/dark.png"),
    url: "app/groups",
    isActive: false,
  },
  {
    titleKey: "menu.settings",
    iconLight: assetUrl("settings/light.png"),
    iconDark: assetUrl("settings/dark.png"),
    url: "app/settings",
    isActive: false,
  },
];

export const studentMenu = [
  {
    titleKey: "menu.dashboard",
    iconLight: assetUrl("home/light.png"),
    iconDark: assetUrl("home/dark.png"),
    url: "app/dashboard",
    isActive: true,
  },
  {
    titleKey: "menu.assigned_qcm",
    iconLight: assetUrl("quiz/light.png"),
    iconDark: assetUrl("quiz/dark.png"),
    url: "app/assigned",
    isActive: false,
  },
  {
    titleKey: "menu.results",
    iconLight: assetUrl("result/light.png"),
    iconDark: assetUrl("result/dark.png"),
    url: "app/results",
    isActive: false,
  },
  {
    titleKey: "menu.settings",
    iconLight: assetUrl("settings/light.png"),
    iconDark: assetUrl("settings/dark.png"),
    url: "app/settings",
    isActive: false,
  },
];

export const useMenuStore = create<MenuState>((set, get) => ({
  navMain: [],
  active: null,

  // Permet d'initialiser le menu (depuis data)
  setMenu: (menu) => set({ navMain: menu }),

  setActive: (url: string) =>
    set((state) => ({
      navMain: state.navMain.map((item) => ({
        ...item,
        isActive: item.url === url,
      })),
    })),
}));
