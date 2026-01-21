import { AppLayout } from "~/components/app-layout";
import { DeleteAccountButton } from "~/components/delete-account-button";
import { LanguageSettingsCard } from "~/components/lang-settings";
import { UserSettingsForm } from "~/components/user-settings-form";
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
