import * as React from "react";
import { useNavigate } from "react-router-dom";
import { getApiErrorMessage } from "~/api/axios";
import { deleteUser } from "~/api/user";
import { useAuthStore } from "~/store/auth";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { useTranslation } from "react-i18next";

export function DeleteAccountButton({ id }: { id: number | undefined }) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const clearAuth = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleDelete = async () => {
    setError(null);
    setLoading(true);
    try {
      await deleteUser(id!);
      clearAuth?.();
      navigate("/login");
    } catch (err: unknown) {
      setError(
        getApiErrorMessage(err, t("settings_page.delete_account.delete_failed"))
      );
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/5 p-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="font-semibold text-red-500">
            {t("settings_page.delete_account.danger_zone")}
          </div>
          <div className="text-sm opacity-80">
            {t("settings_page.delete_account.permanently_delete_account")}
          </div>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button
              type="button"
              className="rounded-2xl px-4 py-2 text-sm font-semibold transition
                         bg-red-600/90 text-white hover:bg-red-600
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t("settings_page.delete_account.title")}
            </button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {t("settings_page.delete_account.title")}
              </DialogTitle>
              <DialogDescription>
                {t("settings_page.delete_account.description")}
              </DialogDescription>
            </DialogHeader>

            {error && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <DialogFooter className="gap-2 sm:gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-2xl px-4 py-2 text-sm font-semibold transition
                           border border-white/10 bg-white/5 hover:bg-white/10"
                disabled={loading}
              >
                {t("settings_page.delete_account.cancel")}
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={loading}
                className="rounded-2xl px-4 py-2 text-sm font-semibold transition
                           bg-red-600/90 text-white hover:bg-red-600
                           disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? t("settings_page.delete_account.deleting")
                  : t("settings_page.delete_account.yes_delete")}
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
