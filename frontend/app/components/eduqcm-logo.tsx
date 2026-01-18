import { useTranslation } from "react-i18next";

export function EduQcmLogo() {
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-3">
      <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center">
        {/* mini icône "Q" stylée */}
        <span className="text-[var(--card)] font-black text-xl">Q</span>
      </div>
      <div className="leading-tight">
        <div className="font-semibold text-[var(--text)]">{t("app_name")}</div>
        <div className="text-sm opacity-70">{t("header.quiz_platform")}</div>
      </div>
    </div>
  );
}
