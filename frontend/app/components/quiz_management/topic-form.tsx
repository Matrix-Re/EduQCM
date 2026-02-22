import React, { type FormEvent, useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { useTopicStore } from "~/store/topic";
import { createTopic, updateTopic } from "~/api/topic";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

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
  const { t } = useTranslation();

  const error =
    touched && label.trim() === "" ? t("quiz_management.label_required") : "";

  useEffect(() => {
    if (!mode) setMode("create");

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
        createTopic(label.trim()).then((r) => addTopic(r));
        setTouched(false);
        setLabel("");
        toast.success(t("quiz_management.topic_created_success"));
      } catch (error) {
        toast.error(t("quiz_management.failed_to_create_topic"));
      }
    }
    if (mode === "edit") {
      try {
        updateTopic(id, label.trim()).then((r) =>
          useTopicStore.getState().updateTopic(r)
        );
        setMode("create");
        toast.success(t("quiz_management.topic_updated_success"));
      } catch (error) {
        toast.error(t("quiz_management.failed_to_update_topic"));
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
          {t("quiz_management.label")}
        </label>
        <input
          id="topic-label"
          name="label"
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          onBlur={() => setTouched(true)}
          className="mt-1 block w-full rounded border px-3 py-2"
          placeholder={t("quiz_management.enter_topic_label")}
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
        <Button
          variant="outline"
          className={mode === "edit" ? "" : "hidden"}
          onClick={handleCancel}
        >
          {t("quiz_management.cancel")}
        </Button>
        <Button
          className="bg-[var(--success)] hover:bg-[var(--success-hover)]"
          onClick={handleSubmit}
        >
          {mode === "edit"
            ? t("quiz_management.save")
            : t("quiz_management.create")}
        </Button>
      </div>
    </form>
  );
}
