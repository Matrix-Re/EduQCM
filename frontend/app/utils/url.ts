const VITE_APP_URL = import.meta.env.VITE_APP_URL ?? "";

export function assetUrl(filename: string) {
  const base = VITE_APP_URL.replace(/\/$/, "");
  return base ? `${base}/icon/${filename}` : `/icon/${filename}`;
}
