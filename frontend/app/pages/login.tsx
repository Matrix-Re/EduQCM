import PublicLayout from "~/components/layout/public-layout";
import { MiniInfo } from "~/components/shared/mini-info.js";
import { SigninForm } from "~/components/auth/signin-form";
import { useTranslation } from "react-i18next";
import "~/i18n.ts";
import { BackgroundDecoration } from "~/components/shared/background-decoration.js";

export default function Login() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <BackgroundDecoration />

      <div className="relative mx-auto max-w-6xl px-6 py-10">
        <PublicLayout
          pageTitle={t("login.login")}
          text={t("common.navigation.back_to_home")}
          link="/"
        >
          {/* content */}
          <div className="mt-14 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* left side pitch */}
            <div className="hidden lg:block">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs opacity-90">
                <span className="h-2 w-2 rounded-full bg-[var(--primary)]" />
                {t("login.login_to_your_space")}
              </div>

              <h1 className="mt-4 text-4xl font-extrabold tracking-tight">
                {t("login.happy_to_see_you")}
              </h1>

              <p className="mt-4 text-base opacity-85 leading-relaxed max-w-lg">
                {t("login.description")}
              </p>

              <div className="mt-8 space-y-3 max-w-lg">
                <MiniInfo
                  title={t("login.quick_access")}
                  desc={t("login.quick_access_description")}
                />
                <MiniInfo
                  title={t("login.organization")}
                  desc={t("login.organization_description")}
                />
                <MiniInfo
                  title={t("login.simplicity")}
                  desc={t("login.simplicity_description")}
                />
              </div>
            </div>

            {/* login card */}
            <SigninForm />
          </div>
        </PublicLayout>
      </div>
    </div>
  );
}
