import {MainLayout} from "~/layouts/mainLayout";
import {DataTable} from "~/components/table";
import {Button} from "~/components/ui/button";
import {useNavigate} from "react-router";
import {APP_ROUTES} from "~/constants/appRoutes";
import React, {type SetStateAction, useState} from "react";
import {useQcmStore} from "~/store/qcm";

export default function dashboard() {
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const { removeQcm } = useQcmStore();

    const handleSelectionChange = (newSelectedIds: SetStateAction<number[]>) => {
        setSelectedIds(newSelectedIds);
    };

    const handleDeleteAll = () => {
        selectedIds.forEach((id) => {
            removeQcm(id)
        });

        setSelectedIds([]);
    };

    return (
        <MainLayout>
            <div className="flex justify-between items-center mb-4">
                <Button className="bg-[var(--success)] hover:bg-[var(--success-hover)]"
                        onClick={useNavigate().bind(null, APP_ROUTES.QCM.CREATE)}
                >
                    Create new QcM</Button>

                <Button className={`bg-[var(--error)] hover:bg-[var(--error-hover)]${selectedIds.length === 0 ? ' invisible' : ''}`}
                        onClick={handleDeleteAll}
                >
                    Delete selected Qcm
                </Button>

            </div>
            <DataTable
                onSelectionChange={handleSelectionChange}
            ></DataTable>
        </MainLayout>
    );
}
