import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import common_fr from "./locales/fr/common.json";
import header_fr from "./locales/fr/header.json";
import footer_fr from "./locales/fr/footer.json";
import home_fr from "./locales/fr/home.json";
import login_fr from "./locales/fr/login.json";
import register_fr from "./locales/fr/register.json";
import quiz_management_fr from "./locales/fr/quiz-management.json";
import settings_fr from "./locales/fr/settings.json";
import error_page_fr from "./locales/fr/error.json";
import error_api_fr from "./locales/fr/error-api.json";

import common_en from "./locales/en/common.json";
import header_en from "./locales/en/header.json";
import footer_en from "./locales/en/footer.json";
import home_en from "./locales/en/home.json";
import login_en from "./locales/en/login.json";
import register_en from "./locales/en/register.json";
import quiz_management_en from "./locales/en/quiz-management.json";
import settings_en from "./locales/en/settings.json";
import error_page_en from "./locales/en/error.json";
import error_api_en from "./locales/en/error-api.json";

const savedLang =
  typeof window !== "undefined" ? localStorage.getItem("lang") : null;

i18n.use(initReactI18next).init({
  lng: savedLang ?? "fr",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
  resources: {
    fr: {
      translation: {
        common: common_fr,
        header: header_fr,
        footer: footer_fr,

        home: home_fr,
        login: login_fr,
        register: register_fr,

        quiz_management: quiz_management_fr,
        settings: settings_fr,
        error_page: error_page_fr,
        error_api: error_api_fr,
      },
    },
    en: {
      translation: {
        common: common_en,
        header: header_en,
        footer: footer_en,

        home: home_en,
        login: login_en,
        register: register_en,

        quiz_management: quiz_management_en,
        settings: settings_en,
        error_page: error_page_en,
        error_api: error_api_en,
      },
    },
  },
});

export default i18n;
