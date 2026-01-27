import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { FieldGroup } from "~/components/ui/field";
import { Field } from "~/components/shared/field.js";
import { useState } from "react";
import { useAuthStore } from "~/store/auth";
import { login } from "~/api/auth";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import React from "react";
import "../../i18n.ts";
import { useTranslation } from "react-i18next";
import { getApiErrorMessage } from "~/api/axios.js";

type LoginForm = {
  username: string;
  password: string;
};

export function SigninForm({ ...props }: React.ComponentProps<typeof Card>) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [form, setForm] = React.useState<LoginForm>({
    username: "",
    password: "",
  });
  const { t } = useTranslation();

  const onChange =
    (key: keyof LoginForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
    };

  const canSubmit =
    form.username.trim().length > 0 && form.password.length > 0 && !loading;

  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const fd = new FormData(e.currentTarget);
    const username = String(fd.get("username") ?? "").trim();
    const password = String(fd.get("password") ?? "");

    if (!username || !password) {
      console.log(username, password);
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const data = await login(username, password);
      console.log("login success", { ...data });
      setAuth({ ...data }, data.access_token);
      navigate("/app");
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, "Login failed. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>{t("login_page.form.title")}</CardTitle>
        <CardDescription>{t("login_page.form.description")}</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FieldGroup>
            <Field label={t("login_page.form.username")} htmlFor="username">
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                value={form.username}
                onChange={onChange("username")}
                placeholder="ex: anas@ecole.fr"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-[var(--primary)]/60 focus:bg-white/10 transition"
              />
            </Field>

            <Field
              label={t("login_page.form.password")}
              htmlFor="password"
              rightSlot={
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="text-xs font-medium opacity-70 hover:opacity-100 transition"
                >
                  {showPassword
                    ? t("login_page.form.hide_password")
                    : t("login_page.form.show_password")}
                </button>
              }
            >
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={form.password}
                onChange={onChange("password")}
                placeholder="••••••••"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-[var(--primary)]/60 focus:bg-white/10 transition"
              />
            </Field>

            {error && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={!canSubmit}
              className="
                    w-full rounded-2xl px-5 py-3 font-semibold transition
                    bg-[var(--primary)] text-white
                    hover:bg-[var(--primary-hover)]
                    disabled:opacity-50 disabled:cursor-not-allowed
                  "
            >
              {isLoading
                ? t("login_page.form.connexion") + "..."
                : t("login_page.form.connexion")}
            </button>

            <div className="text-center text-sm opacity-80">
              {t("login_page.form.first_connection")}{" "}
              <Link
                to="/register"
                className="font-medium underline underline-offset-4 hover:opacity-100"
              >
                {t("login_page.form.create_account")}
              </Link>
            </div>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
