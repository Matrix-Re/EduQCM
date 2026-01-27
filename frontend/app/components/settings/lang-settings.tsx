import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import React from "react";
import "../i18n.ts";
import { useTranslation } from "react-i18next";
import { LangSwitcher } from "~/components/shared/lang-switcher.js"; // adapte le path si besoin

type LanguageSettingsCardProps = React.ComponentProps<typeof Card>;

export function LanguageSettingsCard({
  className,
  ...props
}: LanguageSettingsCardProps) {
  const { t } = useTranslation();

  return (
    <Card {...props} className={`w-full ${className ?? ""}`}>
      <CardHeader>
        <CardTitle>{t("settings_page.language.title") || "Language"}</CardTitle>
        <CardDescription>
          {t("settings_page.language.description")}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="font-semibold">
                {t("settings_page.language.label")}
              </div>
              <div className="text-sm opacity-80">
                {t("settings_page.language.hint")}
              </div>
            </div>

            <div className="shrink-0">
              <LangSwitcher />
            </div>
          </div>
        </div>

        <div className="text-xs opacity-60">
          {t("settings_page.language.note")}
        </div>
      </CardContent>
    </Card>
  );
}
