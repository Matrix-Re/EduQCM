import { AppLayout } from "~/components/layout/app-layout";
import "~/i18n";
import { useTranslation } from "react-i18next";
import { TableQcm } from "~/components/quiz_list/tableQcm";

export default function QuizManagement() {
  const { t } = useTranslation();

  return (
    <AppLayout pageTitle={t("quiz_management.page_title")}>
      <h1 className="text-3xl font-bold mb-6">
        {t("common.navigation.list_qcm")}
      </h1>
      <TableQcm
        onSelectionChange={(newSelectedIds) => {
          console.log("Selected QCM IDs:", newSelectedIds);
        }}
      />
    </AppLayout>
  );
}
