import React from "react";
import PublicLayout from "~/components/public-layout";
import { MiniInfo } from "~/components/mini-info.js";
import { useNavigate } from "react-router-dom";
import { SigninForm } from "~/components/signin-form";
import { useTranslation } from "react-i18next";
import "../i18n.ts";

export default function Login() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* background décor */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[var(--primary)]/20 blur-3xl" />
        <div className="absolute top-32 -right-24 h-72 w-72 rounded-full bg-[var(--accent)]/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[var(--primary)]/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 py-10">
        <PublicLayout
          pageTitle={t("login_page.login")}
          text={t("login_page.back_to_home")}
          link="/"
        >
          {/* content */}
          <div className="mt-14 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* left side pitch */}
            <div className="hidden lg:block">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs opacity-90">
                <span className="h-2 w-2 rounded-full bg-[var(--primary)]" />
                {t("login_page.login_to_your_space")}
              </div>

              <h1 className="mt-4 text-4xl font-extrabold tracking-tight">
                {t("login_page.happy_to_see_you")}
              </h1>

              <p className="mt-4 text-base opacity-85 leading-relaxed max-w-lg">
                {t("login_page.description")}
              </p>

              <div className="mt-8 space-y-3 max-w-lg">
                <MiniInfo
                  title={t("login_page.quick_access")}
                  desc={t("login_page.quick_access_description")}
                />
                <MiniInfo
                  title={t("login_page.organization")}
                  desc={t("login_page.organization_description")}
                />
                <MiniInfo
                  title={t("login_page.simplicity")}
                  desc={t("login_page.simplicity_description")}
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

function Field({
  label,
  htmlFor,
  children,
  rightSlot,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
  rightSlot?: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label htmlFor={htmlFor} className="text-sm font-medium opacity-90">
          {label}
        </label>
        {rightSlot}
      </div>
      {children}
    </div>
  );
}
