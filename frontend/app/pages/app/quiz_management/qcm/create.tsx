import { useNavigate } from "react-router-dom";
import { AppLayout } from "~/components/layout/app-layout";
import { QcmForm } from "~/components/quiz_management/qcm-form";
import { Button } from "~/components/ui/button";
import { APP_ROUTES } from "~/constants/appRoutes";
import { useTranslation } from "react-i18next";

export default function create() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <AppLayout>
      <Button
        className={`bg-[var(--primary)] hover:bg-[var(--primary-hover)] mb-4`}
        onClick={() => navigate(APP_ROUTES.APP.QUIZ_MANAGEMENT.INDEX)}
      >
        {t("quiz_management.back_to_list")}
      </Button>
      <QcmForm />
    </AppLayout>
  );
}
