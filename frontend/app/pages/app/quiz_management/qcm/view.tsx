import { AppLayout } from "~/components/layout/app-layout";
import { QcmForm } from "~/components/quiz_management/qcm-form";
import { useEffect, useState } from "react";
import { getQcmById } from "~/api/qcm";
import { Button } from "~/components/ui/button";
import { APP_ROUTES } from "~/constants/appRoutes";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export default function view({ params }: { params: { id: string } }) {
  const { id } = params;
  const [data, setData] = useState(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    if (!id) return;

    getQcmById(Number(id))
      .then((res) => setData(res))
      .catch((err) => toast.error(t("quiz_management.error_loading_qcm"), err));
  }, [id]);

  return (
    <AppLayout>
      <Button
        className={`bg-[var(--primary)] hover:bg-[var(--primary-hover)] mb-4`}
        onClick={() => navigate(APP_ROUTES.APP.QUIZ_MANAGEMENT.INDEX)}
      >
        {t("quiz_management.back_to_list")}
      </Button>
      <QcmForm mode="view" initialData={data} />
    </AppLayout>
  );
}
