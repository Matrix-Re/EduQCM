import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { FieldGroup } from "~/components/ui/field";
import { Field } from "~/components/shared/field.js";
import React from "react";
import { useAuthStore } from "~/store/auth";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { register } from "~/api/auth";
import "../../i18n.ts";
import { useTranslation } from "react-i18next";
import { getApiErrorMessage } from "~/api/axios.js";

type SignupFormState = {
  firstname: string;
  lastname: string;
  username: string;
  password: string;
  confirmPassword: string;
};

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const { t } = useTranslation();

  const [form, setForm] = React.useState<SignupFormState>({
    firstname: "",
    lastname: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  const onChange =
    (key: keyof SignupFormState) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
    };

  const canSubmit =
    form.firstname.trim().length > 0 &&
    form.lastname.trim().length > 0 &&
    form.username.trim().length > 0 &&
    form.password.length > 0 &&
    form.confirmPassword.length > 0 &&
    !loading;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const firstname = form.firstname.trim();
    const lastname = form.lastname.trim();
    const username = form.username.trim();
    const password = form.password;
    const confirmPassword = form.confirmPassword;

    if (!firstname || !lastname || !username || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const data = await register(
        firstname,
        lastname,
        username,
        password,
        "student"
      );
      setAuth({ ...data }, data.access_token);
      navigate("/app");
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, "Signup failed. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>{t("register_page.form.title")}</CardTitle>
        <CardDescription>{t("register_page.form.description")}</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FieldGroup>
            <Field
              label={t("register_page.form.firstname")}
              htmlFor="firstname"
            >
              <input
                id="firstname"
                name="firstname"
                type="text"
                autoComplete="given-name"
                value={form.firstname}
                onChange={onChange("firstname")}
                placeholder="John"
                disabled={loading}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-[var(--primary)]/60 focus:bg-white/10 transition disabled:opacity-60"
              />
            </Field>

            <Field label={t("register_page.form.lastname")} htmlFor="lastname">
              <input
                id="lastname"
                name="lastname"
                type="text"
                autoComplete="family-name"
                value={form.lastname}
                onChange={onChange("lastname")}
                placeholder="Doe"
                disabled={loading}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-[var(--primary)]/60 focus:bg-white/10 transition disabled:opacity-60"
              />
            </Field>

            <Field label={t("register_page.form.username")} htmlFor="username">
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                value={form.username}
                onChange={onChange("username")}
                placeholder="anas"
                disabled={loading}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-[var(--primary)]/60 focus:bg-white/10 transition disabled:opacity-60"
              />
            </Field>

            <Field
              label={t("register_page.form.password")}
              htmlFor="password"
              rightSlot={
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="text-xs font-medium opacity-70 hover:opacity-100 transition"
                >
                  {showPassword
                    ? t("register_page.form.hide_password")
                    : t("register_page.form.show_password")}
                </button>
              }
            >
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={form.password}
                onChange={onChange("password")}
                placeholder="••••••••"
                disabled={loading}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-[var(--primary)]/60 focus:bg-white/10 transition disabled:opacity-60"
              />
              <p className="mt-2 text-xs opacity-70">
                {t("register_page.form.password_requirements")}
              </p>
            </Field>

            <Field
              label={t("register_page.form.confirm_password")}
              htmlFor="confirmPassword"
              rightSlot={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="text-xs font-medium opacity-70 hover:opacity-100 transition"
                >
                  {showConfirmPassword
                    ? t("register_page.form.hide_password")
                    : t("register_page.form.show_password")}
                </button>
              }
            >
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                value={form.confirmPassword}
                onChange={onChange("confirmPassword")}
                placeholder="••••••••"
                disabled={loading}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-[var(--primary)]/60 focus:bg-white/10 transition disabled:opacity-60"
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
              {loading
                ? t("register_page.form.creating")
                : t("register_page.form.create_account")}
            </button>

            <div className="text-center text-sm opacity-80">
              {t("register_page.form.already_have_account")}{" "}
              <Link
                to="/login"
                className="font-medium underline underline-offset-4 hover:opacity-100"
              >
                {t("register_page.form.sign_in")}
              </Link>
            </div>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
