import { useTranslation } from "node_modules/react-i18next";
import { Link } from "react-router-dom";

type ErrorPageProps = {
  title?: string;
  subtitle?: string;
  details?: string;
};

export default function ErrorPage({
  title = "Something went wrong",
  subtitle = "We couldn’t reach the server. Please try again.",
  details,
}: ErrorPageProps) {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--background)] flex items-center justify-center px-6">
      <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-[var(--primary)] p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="min-w-0">
            <div className="text-base font-semibold">{title}</div>
            <div className="mt-1 text-sm opacity-80">{subtitle}</div>

            {details && (
              <pre className="mt-4 max-h-40 overflow-auto rounded-2xl bg-white/10 p-3 text-xs opacity-90 whitespace-pre-wrap">
                {details}
              </pre>
            )}

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="rounded-xl px-4 py-2 text-sm font-semibold border border-white/20 bg-white/10 hover:bg-white/15 transition"
              >
                {t("error_page.reload")}
              </button>

              <Link
                to="/"
                className="ml-auto text-sm font-semibold underline underline-offset-4 opacity-90 hover:opacity-100 transition"
              >
                {t("error_page.back_to_home")}
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-6 text-xs opacity-70">
          {t("error_page.something_went_wrong")}
        </div>
      </div>
    </div>
  );
}

function ErrorIcon() {
  return (
    <div
      className="
        relative h-10 w-10 shrink-0 rounded-2xl
        border border-white/10 bg-white/5
        flex items-center justify-center
      "
      aria-hidden
    >
      <span className="text-xl leading-none">⚠️</span>
    </div>
  );
}
