import {MainLayout} from "~/layouts/mainLayout";
import {QcmForm} from "~/components/qcm-form";
import {getQcmById} from "~/api/qcm";
import {useEffect, useState} from "react";

export default function edit({ params }: { params: { id: string } }) {
    const { id } = params;
    const [data, setData] = useState(null);

    useEffect(() => {
        if (!id) return;

        getQcmById(Number(id))
            .then((res) => setData(res))
            .catch((err) => console.error("Error loading QCM:", err));
    }, [id]);

    return (
        <MainLayout>
            <QcmForm
                mode="edit"
                initialData={data}
            />
        </MainLayout>
    );
}
