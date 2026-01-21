import PublicLayout from "~/components/public-layout";
import { MiniInfo } from "~/components/mini-info.js";
import { SignupForm } from "~/components/signup-form";
import "../i18n.ts";
import { useTranslation } from "react-i18next";
import { BackgroundDecoration } from "~/components/background-decoration.js";

export default function Register() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <BackgroundDecoration />

      <div className="relative mx-auto max-w-6xl px-6 py-10">
        <PublicLayout
          pageTitle={t("register_page.register")}
          text={t("register_page.back_to_home")}
          link="/"
        >
          <div className="mt-14 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* left side pitch */}
            <div className="hidden lg:block">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs opacity-90">
                <span className="h-2 w-2 rounded-full bg-[var(--primary)]" />
                {t("register_page.create_account")}
              </div>

              <h1 className="mt-4 text-4xl font-extrabold tracking-tight">
                {t("register_page.welcome")}
              </h1>

              <p className="mt-4 text-base opacity-85 leading-relaxed max-w-lg">
                {t("register_page.description")}
              </p>

              <div className="mt-8 space-y-3 max-w-lg">
                <MiniInfo
                  title={t("register_page.simple")}
                  desc={t("register_page.simple_description")}
                />
                <MiniInfo
                  title={t("register_page.organized")}
                  desc={t("register_page.organized_description")}
                />
                <MiniInfo
                  title={t("register_page.practical")}
                  desc={t("register_page.practical_description")}
                />
              </div>
            </div>

            {/* register card */}
            <SignupForm />
          </div>
        </PublicLayout>
      </div>
    </div>
  );
}
