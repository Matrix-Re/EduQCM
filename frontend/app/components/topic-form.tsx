import React, {type FormEvent, useEffect, useState} from "react";
import {Button} from "~/components/ui/button";
import {useTopicStore} from "~/store/topic";
import {createTopic, updateTopic} from "~/api/topic";

type TopicFormProps = {
    initialLabel?: string;
    submitText?: string;
    onSubmit: (label: string) => void;
    disabled?: boolean;
};

export default function TopicForm({
                                      initialLabel = "",
                                      onSubmit,
                                      disabled = false,
                                  }: TopicFormProps) {
    const [label, setLabel] = useState(initialLabel);
    const [touched, setTouched] = useState(false);
    const [id, setId] = useState<number>(0);
    const { mode, addTopic, setMode, currentTopic } = useTopicStore();

    const error = touched && label.trim() === "" ? "Le label est requis." : "";

    useEffect(() => {
        if (!mode) setMode("create")

        if (mode === "edit" && currentTopic) {
            setLabel(currentTopic.label);
            setId(currentTopic.id);
        }
        if (mode === "create") {
            setLabel("");
        }
    }, [mode, currentTopic]);

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setTouched(true);
        if (label.trim() === "") return;
        onSubmit(label.trim());

        if (mode === "create") {
            try {
                createTopic(label.trim()).then(r =>
                    addTopic(r));
            }
            catch (error) {
                console.error("Failed to create topic:", error);
            }
        }
        if (mode === "edit") {
            try {
                updateTopic(id, label.trim()).then(r =>
                    useTopicStore.getState().updateTopic(r));
                    setMode("create");
            }
            catch (error) {
                console.error("Failed to update topic:", error);
            }
        }
    }

    function handleCancel(e: FormEvent) {
        e.preventDefault();
        setMode("create");
        setLabel("");
    }

    return (
        <form className="space-y-3">
            <div>
                <label htmlFor="topic-label" className="block text-sm font-medium">
                    Label
                </label><input
                    id="topic-label"
                    name="label"
                    type="text"
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    onBlur={() => setTouched(true)}
                    className="mt-1 block w-full rounded border px-3 py-2"
                    placeholder="Entrez le label du topic"
                    aria-invalid={!!error}
                    aria-describedby={error ? "label-error" : undefined}
                    disabled={disabled}
                />

                {error && (
                    <p id="label-error" className="mt-1 text-sm text-red-600">
                        {error}
                    </p>
                )}
            </div>

            <div className="flex justify-end gap-2">
                <Button variant="outline" className={mode === "edit" ? "" : "hidden"}
                        onClick={handleCancel}>
                    Cancel
                </Button>
                <Button className="bg-[var(--success)] hover:bg-[var(--success-hover)]"
                        onClick={handleSubmit}>
                    {mode === "edit" ? "Save" : "Create"}
                </Button>
            </div>
        </form>
    );
}
