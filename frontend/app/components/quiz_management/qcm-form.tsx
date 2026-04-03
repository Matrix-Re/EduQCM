import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Field, FieldLabel } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { SelectCustom } from "~/components/shared/select-custom";
import { getAllTopics } from "~/api/topic";
import { createQcm, updateQcm } from "~/api/qcm";
import { useAuthStore } from "~/store/auth";
import { createQuestion, deleteQuestion, updateQuestion } from "~/api/question";
import { createProposal, deleteProposal, updateProposal } from "~/api/proposal";
import { APP_ROUTES } from "~/constants/appRoutes";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { getApiErrorMessage } from "~/api/axios";

export function QcmForm({
  mode = "create",
  initialData,
}: {
  mode?: "create" | "edit" | "view";
  initialData?: any;
}) {
  const isReadOnly = mode === "view";
  const isEditing = mode === "edit";
  const isCreating = mode === "create";

  const [label, setLabel] = useState<string | undefined>();
  const [topics, setTopics] = useState<{ value: string; label: string }[]>([]);
  const [topicId, setTopicId] = useState<string | undefined>();

  const auth = useAuthStore((state) => state.auth);

  const navigate = useNavigate();
  const { t } = useTranslation();

  // If editing or viewing, load questions from initialData
  useEffect(() => {
    if (initialData && (isEditing || isReadOnly)) {
      setLabel(initialData.label);
      setTopicId(String(initialData.topic.id));

      setQuestions(
        initialData.questions.map((q: any, qi: number) => ({
          id: qi + 1,
          backendId: q.id,
          text: q.label,
          proposals: q.proposals.map((p: any, pi: number) => ({
            id: pi + 1,
            backendId: p.id,
            text: p.label,
            isCorrect: p.is_correct,
          })),
        }))
      );
    }
  }, [initialData]);

  // --- Questions State ---
  const [questions, setQuestions] = useState(() => {
    return Array.from({ length: 3 }).map((_, qIndex) => ({
      id: qIndex + 1,
      backendId: 0,
      text: "",
      proposals: Array.from({ length: 4 }).map((_, pIndex) => ({
        id: pIndex + 1,
        backendId: 0,
        text: "",
        isCorrect: false,
      })),
    }));
  });

  // Load Topics
  useEffect(() => {
    (async () => {
      const data = await getAllTopics();
      setTopics(
        data.map((t: any) => ({
          value: String(t.id),
          label: t.label,
        }))
      );
    })();
  }, []);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: questions.length + 1,
        backendId: 0,
        text: "",
        proposals: Array.from({ length: 4 }).map((_, index) => ({
          id: index + 1,
          backendId: 0,
          text: "",
          isCorrect: false,
        })),
      },
    ]);
  };

  const removeQuestion = (index: number) => {
    if (questions.length <= 1) return; // avoid having zero question

    const updated = questions.filter((_, qIndex) => qIndex !== index);

    // Reindex questions to maintain consistent ids for form handling
    const reindexed = updated.map((q, i) => ({
      ...q,
      id: i + 1,
    }));

    setQuestions(reindexed);
  };

  const updateQuestionText = (index: number, text: string) => {
    const updated = [...questions];
    updated[index].text = text;
    setQuestions(updated);
  };

  const updateProposalText = (qIndex: number, pIndex: number, text: string) => {
    const updated = [...questions];
    updated[qIndex].proposals[pIndex].text = text;
    setQuestions(updated);
  };

  const toggleCorrect = (qIndex: number, pIndex: number) => {
    const updated = [...questions];
    updated[qIndex].proposals[pIndex].isCorrect =
      !updated[qIndex].proposals[pIndex].isCorrect;
    setQuestions(updated);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    const payload = {
      label: e.target.label.value,
      topicId,
      questions,
    };

    if (isCreating) {
      createQcmWithDetails(payload);
    }
    if (isEditing) {
      updateQcmWithDetails(payload);
    }
  };

  const createQcmWithDetails = async (payload: any) => {
    let result = null;
    try {
      result = await createQcm({
        label: payload.label,
        time_limit: 0,
        author_id: Number(auth?.id),
        topic_id: Number(payload.topicId),
        questions: questions.map((question) => ({
          label: question.text,
          proposals: question.proposals.map((prop) => ({
            label: prop.text,
            isCorrect: prop.isCorrect,
          })),
        })),
      });

      toast.success("QCM created successfully");
      navigate(APP_ROUTES.APP.QUIZ_MANAGEMENT.INDEX);
    } catch (err) {
      toast.error(
        getApiErrorMessage(err, t("common.messages.unexpectedError"))
      );
    }
  };

  const updateQcmWithDetails = async (payload: any) => {
    try {
      const qcmId = initialData.id;

      await updateQcm(qcmId, {
        label: payload.label,
        topic_id: Number(payload.topicId),

        questions: questions.map((q) => ({
          id: q.backendId, // undefined = new question
          label: q.text,

          proposals: q.proposals.map((p) => ({
            id: p.backendId, // undefined = new proposal
            label: p.text,
            isCorrect: p.isCorrect,
          })),
        })),
      });

      toast.success(t("common.messages.updated"));
      navigate(APP_ROUTES.APP.QUIZ_MANAGEMENT.INDEX);
    } catch (err) {
      toast.error(
        getApiErrorMessage(err, t("common.messages.unexpectedError"))
      );
    }
  };

  const createNewQuestionWithProposals = async (
    question: any,
    qcmId: string
  ) => {
    try {
      const created = await createQuestion(question.text, qcmId);
      const newQuestionId = created.id;

      // create proposals for the new question
      for (const p of question.proposals) {
        await createProposal(p.text, newQuestionId, p.isCorrect);
      }
    } catch (err) {
      toast.error(
        getApiErrorMessage(err, t("common.messages.unexpectedError"))
      );
    }
  };

  const updateExistingQuestion = async (q: any, existing: any) => {
    // Update question
    await updateQuestion(existing.id, q.text);

    const existingProps = existing.proposals;

    // for each proposal in the form
    for (const p of q.proposals) {
      // find existing proposal in backend
      const ep = existingProps.find((xp: any) => xp.id === p.backendId);

      // if not found create new proposal
      if (!ep) {
        await createProposal(p.text, existing.id, p.isCorrect);
        continue;
      }

      // Otherwise update existing proposal
      await updateProposal(ep.id, p.text, p.isCorrect);
    }

    // Delete removed proposals
    for (const ep of existingProps) {
      const stillThere = q.proposals.some((p: any) => p.backendId === ep.id);

      if (!stillThere) {
        await deleteProposal(ep.id);
      }
    }
  };

  const deleteRemovedQuestions = async (
    existingQuestions: any[],
    currentQuestions: any[]
  ) => {
    for (const oldQ of existingQuestions) {
      const stillHere = currentQuestions.some((q) => q.backendId === oldQ.id);
      if (!stillHere) {
        await deleteQuestion(oldQ.id);
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isCreating && t("quiz_management.create_qcm")}
          {isEditing && t("quiz_management.edit_qcm")}
          {isReadOnly && t("quiz_management.view_qcm")}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Label */}
          <Field>
            <FieldLabel>{t("quiz_management.label")}</FieldLabel>
            <Input
              name="label"
              placeholder={t("quiz_management.placeholder_label")}
              value={label}
              disabled={isReadOnly}
              onChange={(e) => setLabel(e.target.value)}
              className={isReadOnly ? "bg-[var(--muted)]" : ""}
              required
            />
          </Field>

          {/* Topic */}
          <Field>
            <FieldLabel>{t("quiz_management.topic")}</FieldLabel>
            <SelectCustom
              items={topics}
              value={topicId}
              onValueChange={setTopicId}
              placeholder={t("quiz_management.placeholder_topic")}
              label={t("quiz_management.topic")}
              disabled={isReadOnly}
            />
          </Field>

          {/* Questions */}
          <div className="space-y-6 mt-6">
            {questions.map((q, qIndex) => (
              <div key={q.id} className="p-4 border rounded-md space-y-4">
                <Field>
                  <div className="flex w-full justify-between">
                    <FieldLabel>
                      {t("quiz_management.question")} {qIndex + 1}
                    </FieldLabel>
                    {!isReadOnly && (
                      <Button
                        className="bg-[var(--error)] hover:bg-[var(--error-hover)]"
                        onClick={(e) => {
                          e.preventDefault();
                          removeQuestion(qIndex);
                        }}
                      >
                        {t("quiz_management.delete_question")}
                      </Button>
                    )}
                  </div>
                  <Input
                    placeholder={t("quiz_management.placeholder_question")}
                    value={q.text}
                    disabled={isReadOnly}
                    className={isReadOnly ? "bg-[var(--muted)]" : ""}
                    onChange={(e) => updateQuestionText(qIndex, e.target.value)}
                  />
                </Field>

                {/* Proposals */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {q.proposals.map((p, pIndex) => (
                    <div
                      key={p.id}
                      className="flex items-center gap-2 border rounded-md p-2"
                    >
                      <Input
                        placeholder={t("quiz_management.placeholder_proposal", {
                          index: pIndex + 1,
                        })}
                        value={p.text}
                        disabled={isReadOnly}
                        className={isReadOnly ? "bg-[var(--muted)]" : ""}
                        onChange={(e) =>
                          updateProposalText(qIndex, pIndex, e.target.value)
                        }
                      />
                      <input
                        type="checkbox"
                        checked={p.isCorrect}
                        disabled={isReadOnly}
                        className={isReadOnly ? "bg-[var(--muted)]" : ""}
                        onChange={() => toggleCorrect(qIndex, pIndex)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {!isReadOnly && (
            <div className="flex flex-col gap-4 mt-4">
              {/* Add Question */}
              <Button
                type="button"
                className="w-full"
                onClick={(e) => {
                  e.preventDefault();
                  addQuestion();
                }}
              >
                + {t("quiz_management.add_question")}
              </Button>

              {/* Submit */}
              <Button
                type="submit"
                className="w-full bg-[var(--success)] hover:bg-[var(--success-hover)]"
              >
                {isCreating
                  ? t("quiz_management.create")
                  : t("quiz_management.save")}
              </Button>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
