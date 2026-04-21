import { create } from "zustand";
import { APP_ROUTES } from "~/constants/appRoutes";
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
    titleKey: "common.navigation.dashboard",
    iconLight: assetUrl("home/light.png"),
    iconDark: assetUrl("home/dark.png"),
    url: APP_ROUTES.APP.DASHBOARD,
    isActive: true,
  },
  {
    titleKey: "common.navigation.qcm_management",
    iconLight: assetUrl("quiz/light.png"),
    iconDark: assetUrl("quiz/dark.png"),
    url: APP_ROUTES.APP.QUIZ_MANAGEMENT.INDEX,
    isActive: false,
  },
  {
    titleKey: "common.navigation.users_management",
    iconLight: assetUrl("user/light.png"),
    iconDark: assetUrl("user/dark.png"),
    url: "app/users",
    isActive: false,
  },
  {
    titleKey: "common.navigation.results",
    iconLight: assetUrl("result/light.png"),
    iconDark: assetUrl("result/dark.png"),
    url: "app/results",
    isActive: false,
  },
  {
    titleKey: "common.navigation.groups_management",
    iconLight: assetUrl("group/light.png"),
    iconDark: assetUrl("group/dark.png"),
    url: "app/groups",
    isActive: false,
  },
  {
    titleKey: "common.navigation.settings",
    iconLight: assetUrl("settings/light.png"),
    iconDark: assetUrl("settings/dark.png"),
    url: APP_ROUTES.APP.SETTINGS,
    isActive: false,
  },
];

export const studentMenu = [
  {
    titleKey: "common.navigation.dashboard",
    iconLight: assetUrl("home/light.png"),
    iconDark: assetUrl("home/dark.png"),
    url: APP_ROUTES.APP.DASHBOARD,
    isActive: true,
  },
  {
    titleKey: "common.navigation.list_qcm",
    iconLight: assetUrl("quiz/light.png"),
    iconDark: assetUrl("quiz/dark.png"),
    url: APP_ROUTES.APP.QUIZ_LIST,
    isActive: false,
  },
  {
    titleKey: "common.navigation.assigned_qcm",
    iconLight: assetUrl("quiz/light.png"),
    iconDark: assetUrl("quiz/dark.png"),
    url: "app/assigned",
    isActive: false,
  },
  {
    titleKey: "common.navigation.results",
    iconLight: assetUrl("result/light.png"),
    iconDark: assetUrl("result/dark.png"),
    url: "app/results",
    isActive: false,
  },
  {
    titleKey: "common.navigation.settings",
    iconLight: assetUrl("settings/light.png"),
    iconDark: assetUrl("settings/dark.png"),
    url: APP_ROUTES.APP.SETTINGS,
    isActive: false,
  },
];

export const useMenuStore = create<MenuState>((set, get) => ({
  navMain: [],
  active: null,

  // Initialise the menu (from data)
  setMenu: (menu) => set({ navMain: menu }),

  setActive: (url: string) =>
    set((state) => ({
      navMain: state.navMain.map((item) => ({
        ...item,
        isActive: item.url === url,
      })),
    })),
}));
