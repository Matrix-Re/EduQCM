import { Link } from "react-router";
import { useTranslation } from "react-i18next";

export default function PublicHeader() {
  const { t } = useTranslation();
  return (
    <footer className="mt-16 pb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 opacity-70">
      <div className="text-sm">
        © {new Date().getFullYear()} {t("app_name")} -{" "}
        {t("footer.all_rights_reserved")}
      </div>
      <div className="text-sm">
        {t("footer.project_developed_by")}
        <Link
          to={import.meta.env.VITE_PORTFOLIO_LINK}
          className="font-medium text-[var(--primary)] hover:underline ml-1"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="font-medium">Anas Amiri</span>
        </Link>
      </div>
    </footer>
  );
}
