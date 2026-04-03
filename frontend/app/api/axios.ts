import axios from "axios";
import i18n from "~/i18n";

const VITE_API_URL = import.meta.env.VITE_API_URL ?? "";

export const api = axios.create({
  baseURL: VITE_API_URL,
});

export function getApiErrorMessage(err: unknown, fallback: string) {
  if (axios.isAxiosError(err)) {
    try {
      const message = (err.response?.data as any)?.message;

      return message
        ? i18n.t(`error_api.${message}`)
        : err.response?.statusText
          ? i18n.t(`error_api.${err.response.statusText}`)
          : i18n.t(`error_api.${fallback}`);
    } catch (e) {
      console.error("Error extracting or translating API error message:", e);
      return fallback;
    }
  }

  return err instanceof Error ? err.message : fallback;
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
