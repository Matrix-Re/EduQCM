import { AppLayout } from "~/components/layout/app-layout";
import { DeleteAccountButton } from "~/components/settings/delete-account-button";
import { LanguageSettingsCard } from "~/components/settings/lang-settings";
import { UserSettingsForm } from "~/components/settings/user-settings-form";
import { useAuthStore } from "~/store/auth";

export default function Settings() {
  const auth = useAuthStore((state) => state.auth);
  return (
    <AppLayout pageTitle="Settings">
      <UserSettingsForm user={auth != null ? auth : undefined} />

      <LanguageSettingsCard className="mt-6" />

      <DeleteAccountButton id={auth?.id} />
    </AppLayout>
  );
}
