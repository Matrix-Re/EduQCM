import { TableQcm } from "~/components/quiz_management/tableQcm";
import { Button } from "~/components/ui/button";
import { useNavigate } from "react-router";
import React, { type SetStateAction, useState } from "react";
import { useQcmStore } from "~/store/qcm";
import { PopupTopicManagement } from "~/components/quiz_management/popupTopicManagement";
import { AppLayout } from "~/components/layout/app-layout";
import { APP_ROUTES } from "~/constants/appRoutes";
import { useTranslation } from "react-i18next";

export default function QuizManagement() {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const { removeQcm } = useQcmStore();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSelectionChange = (newSelectedIds: SetStateAction<number[]>) => {
    setSelectedIds(newSelectedIds);
  };

  const handleDeleteAll = () => {
    selectedIds.forEach((id) => {
      removeQcm(id);
    });

    setSelectedIds([]);
  };
  return (
    <AppLayout pageTitle={t("quiz_management.page_title")}>
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-4">
          <Button
            className="bg-[var(--success)] hover:bg-[var(--success-hover)]"
            onClick={() => navigate(APP_ROUTES.APP.QUIZ_MANAGEMENT.CREATE)}
          >
            {t("quiz_management.create_qcm")}
          </Button>

          <PopupTopicManagement></PopupTopicManagement>
        </div>

        <Button
          className={`bg-[var(--error)] hover:bg-[var(--error-hover)]${selectedIds.length === 0 ? " invisible" : ""}`}
          onClick={handleDeleteAll}
        >
          {t("quiz_management.delete_selected_qcm")}
        </Button>
      </div>
      <TableQcm onSelectionChange={handleSelectionChange}></TableQcm>
    </AppLayout>
  );
}
