import axios from "axios";

const VITE_API_URL = import.meta.env.VITE_API_URL ?? "";

export const api = axios.create({
  baseURL: VITE_API_URL,
});

export function getApiErrorMessage(err: unknown, fallback: string) {
  if (axios.isAxiosError(err)) {
    // ton API renvoie { message: "..." }
    return (
      (err.response?.data as any)?.message ??
      err.response?.statusText ??
      fallback
    );
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
