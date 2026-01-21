import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { FieldGroup } from "~/components/ui/field";
import { Field } from "~/components/form";
import React from "react";
import "../i18n.js";
import { useTranslation } from "react-i18next";
import { getApiErrorMessage } from "~/api/axios.js";
import { updateUser } from "~/api/user";
import { useAuthStore, type Auth } from "~/store/auth.js";

type SettingsForm = {
  firstname: string;
  lastname: string;
  username: string;
};

type UserSettingsFormProps = React.ComponentProps<typeof Card> & {
  user?: Auth;
  onUpdated?: (updated: any) => void;
};

export function UserSettingsForm({
  user,
  onUpdated,
  ...props
}: UserSettingsFormProps) {
  const { t } = useTranslation();

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);
  const { updateAuth } = useAuthStore();

  const [form, setForm] = React.useState<SettingsForm>({
    firstname: user?.firstname ?? "",
    lastname: user?.lastname ?? "",
    username: user?.username ?? "",
  });

  React.useEffect(() => {
    setForm({
      firstname: user?.firstname ?? "",
      lastname: user?.lastname ?? "",
      username: user?.username ?? "",
    });
  }, [user]);

  const onChange =
    (key: keyof SettingsForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
    };

  const isDirty =
    form.firstname !== (user?.firstname ?? "") ||
    form.lastname !== (user?.lastname ?? "") ||
    form.username !== (user?.username ?? "");

  const canSubmit =
    form.firstname.trim().length > 0 &&
    form.lastname.trim().length > 0 &&
    form.username.trim().length > 0 &&
    isDirty &&
    !loading;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const fd = new FormData(e.currentTarget);
    const firstname = String(fd.get("firstname") ?? "").trim();
    const lastname = String(fd.get("lastname") ?? "").trim();
    const username = String(fd.get("username") ?? "").trim();

    if (!firstname || !lastname || !username) {
      setError(
        t("settings_page.form.errors.fill_all_fields") ||
          "Please fill in all fields"
      );
      return;
    }

    if (!isDirty) {
      setSuccess(t("settings_page.form.no_changes") || "No changes to save.");
      return;
    }

    setLoading(true);
    try {
      const updated = await updateUser(user.id, {
        firstname,
        lastname,
        username,
      });

      updateAuth(updated);

      setSuccess(
        t("settings_page.form.success") || "Profile updated successfully."
      );
      onUpdated?.(updated);
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, "Update failed. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card {...props} className="w-full">
      <CardHeader className="w-full">
        <CardTitle>{t("settings_page.form.title") || "Settings"}</CardTitle>
        <CardDescription>
          {t("settings_page.form.description") ||
            "Update your profile information."}
        </CardDescription>
      </CardHeader>

      <CardContent className="w-full">
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <FieldGroup className="w-full">
            <Field
              label={t("settings_page.form.firstname") || "First name"}
              htmlFor="firstname"
            >
              <input
                id="firstname"
                name="firstname"
                type="text"
                autoComplete="given-name"
                value={form.firstname}
                onChange={onChange("firstname")}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-[var(--primary)]/60 focus:bg-white/10 transition"
              />
            </Field>

            <Field
              label={t("settings_page.form.lastname") || "Last name"}
              htmlFor="lastname"
            >
              <input
                id="lastname"
                name="lastname"
                type="text"
                autoComplete="family-name"
                value={form.lastname}
                onChange={onChange("lastname")}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-[var(--primary)]/60 focus:bg-white/10 transition"
              />
            </Field>

            <Field
              label={t("settings_page.form.username") || "Username"}
              htmlFor="username"
            >
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                value={form.username}
                onChange={onChange("username")}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-[var(--primary)]/60 focus:bg-white/10 transition"
              />
            </Field>

            {error && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            {success && (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={!canSubmit}
              className="w-full rounded-2xl px-5 py-3 font-semibold transition bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? (t("settings_page.form.save") || "Save changes") + "..."
                : t("settings_page.form.save") || "Save changes"}
            </button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
