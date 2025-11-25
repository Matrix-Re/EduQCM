import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Field, FieldLabel } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { SelectCustom } from "~/components/SelectCustom";
import {getAllTopics} from "~/api/topic";
import {createQcm, updateQcm} from "~/api/qcm";
import {useAuthStore} from "~/store/auth";
import {createQuestion, deleteQuestion, updateQuestion} from "~/api/question";
import {createProposal, deleteProposal, updateProposal} from "~/api/proposal";
import {APP_ROUTES} from "~/constants/appRoutes";
import {useNavigate} from "react-router";

export function QcmForm({ mode = "create", initialData }: {
  mode?: "create" | "edit" | "view",
  initialData?: any
}) {
  const isReadOnly = mode === "view";
  const isEditing = mode === "edit";
  const isCreating = mode === "create";

  const [label, setLabel] = useState<string | undefined>();
  const [topics, setTopics] = useState<{ value: string; label: string }[]>([]);
  const [topicId, setTopicId] = useState<string | undefined>();

  const auth = useAuthStore((state) => state.auth);

  const navigate = useNavigate();

  // If editing or viewing, load questions from initialData
  useEffect(() => {
    if (initialData && (isEditing || isReadOnly)) {
      setLabel(initialData.QCMLabel);
      setTopicId(String(initialData.topicId));

      setQuestions(
          initialData.questions.map((q: any, qi: number) => ({
            id: qi + 1,
            backendId: q.QuestionId,
            text: q.questionLabel,
            proposals: q.proposals.map((p: any, pi: number) => ({
              id: pi + 1,
              backendId: p.ProposalId,
              text: p.proposalLabel,
              isCorrect: p.isCorrect,
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
            value: String(t.TopicId),
            label: t.description,
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
    if (questions.length <= 1) return; // empêcher d'avoir 0 question

    const updated = questions.filter((_, qIndex) => qIndex !== index);

    // Réindexation propre (id = position + 1)
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

  const updateProposalText = (
      qIndex: number,
      pIndex: number,
      text: string
  ) => {
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
    createQcm({ qcmLabel: payload.label, authorId: Number(auth?.UserId), topicId: Number(payload.topicId)  })
        .then(async (res) => {
          const qcmId = res.QCMId;
          console.log("QCM created:", qcmId);

          // For each question
          for (const question of questions) {
            const createdQuestion = await createQuestion(
                question.text,
                0,
                qcmId,
            );

            const questionId = createdQuestion.QuestionId;
            console.log("Question created:", questionId);

            // For each proposal
            for (const prop of question.proposals) {
              await createProposal(
                  prop.text,
                  questionId,
                  prop.isCorrect,
              );
            }
          }

          navigate(APP_ROUTES.QCM.LIST);
        })
        .catch((err) => {
          console.error("Error creating QCM:", err);
        });
  };

  const updateQcmWithDetails = async (payload: any) => {
    try {
      const qcmId = initialData.QCMId;

      // Update QCM basic info
      await updateQcm(qcmId, {
        qcmLabel: payload.label,
        topicId: Number(payload.topicId),
      });

      // Existing questions from backend
      const existingQuestions = structuredClone(initialData.questions);

      // For each question in the form
      for (const q of questions) {
        const existing = existingQuestions.find(eq => eq.QuestionId === q.backendId);

        // Create new question if it doesn't exist
        if (!existing) {
          await createNewQuestionWithProposals(q, qcmId);
          continue;
        }

        // Ohterwise, update existing question
        await updateExistingQuestion(q, existing);
      }

      // 4️⃣ Supprimer les questions retirées dans le formulaire
      deleteRemovedQuestions(existingQuestions, questions);

      navigate(APP_ROUTES.QCM.LIST);
    } catch (err) {
      console.error("Error updating QCM:", err);
      alert("Error updating QCM");
    }
  };

  const createNewQuestionWithProposals = async (question: any, qcmId: string) => {
    try {
      const created = await createQuestion(question.text, 0, qcmId);
      const newQuestionId = created.QuestionId;

      // créer toutes les propositions associées
      for (const p of question.proposals) {
        await createProposal(p.text, newQuestionId, p.isCorrect);
      }
    }
    catch (err) {
      console.error("Error creating question and proposals:", err);
    }
  }


  const updateExistingQuestion = async (q: any, existing: any) => {
    // Update question
    await updateQuestion(existing.QuestionId, q.text,0);

    const existingProps = existing.proposals;

    // for each proposal in the form
    for (const p of q.proposals) {
      // find existing proposal in backend
      const ep = existingProps.find(
          (xp: any) => xp.ProposalId === p.backendId
      );

      // if not found create new proposal
      if (!ep) {
        await createProposal(p.text, existing.QuestionId, p.isCorrect);
        continue;
      }

      // Otherwise update existing proposal
      await updateProposal(ep.ProposalId, p.text, p.isCorrect);
    }

    // Delete removed proposals
    for (const ep of existingProps) {
      const stillThere = q.proposals.some(
          (p: any) => p.backendId === ep.ProposalId
      );

      if (!stillThere) {
        await deleteProposal(ep.ProposalId);
      }
    }
  };

  const deleteRemovedQuestions = async (existingQuestions: any[], currentQuestions: any[]) => {
    for (const oldQ of existingQuestions) {
      const stillHere = currentQuestions.some(
          (q) => q.backendId === oldQ.QuestionId
      );
      if (!stillHere) {
        await deleteQuestion(oldQ.QuestionId);
      }
    }
  }

  return (
      <Card>
        <CardHeader>
          <CardTitle>
            {isCreating && "Create New QCM"}
            {isEditing && "Edit QCM"}
            {isReadOnly && "View QCM"}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Label */}
            <Field>
              <FieldLabel>Label</FieldLabel>
              <Input
                  name="label"
                  placeholder="Ex: Network basics"
                  value={label}
                  disabled={isReadOnly}
                  onChange={(e) => setLabel(e.target.value)}
                  className={isReadOnly ? "bg-[var(--muted)]" : ""}
                  required />
            </Field>

            {/* Topic */}
            <Field>
              <FieldLabel>Topic</FieldLabel>
              <SelectCustom
                  items={topics}
                  value={topicId}
                  onValueChange={setTopicId}
                  placeholder="Select a topic"
                  label="Topics"
                  disabled={isReadOnly}
              />
            </Field>

            {/* Questions */}
            <div className="space-y-6 mt-6">
              {questions.map((q, qIndex) => (
                  <div key={q.id} className="p-4 border rounded-md space-y-4">
                    <Field>
                      <div className="flex w-full justify-between">
                        <FieldLabel>Question {qIndex + 1}</FieldLabel>
                        {!isReadOnly && (
                            <Button
                                className="bg-[var(--error)] hover:bg-[var(--error-hover)]"
                                onClick={(e) => {
                                  e.preventDefault()
                                  removeQuestion(qIndex)
                                }}
                            >
                              Delete this question
                            </Button>
                        )}

                      </div>
                      <Input
                          placeholder="Enter question..."
                          value={q.text}
                          disabled={isReadOnly}
                          className={isReadOnly ? "bg-[var(--muted)]" : ""}
                          onChange={(e) =>
                              updateQuestionText(qIndex, e.target.value)
                          }
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
                                placeholder={`Proposal ${pIndex + 1}`}
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
                  <Button type="button" className="w-full"
                          onClick={(e) => {
                            e.preventDefault()
                            addQuestion();
                          }}>
                    + Add Question
                  </Button>

                  {/* Submit */}
                  <Button type="submit" className="w-full bg-[var(--success)] hover:bg-[var(--success-hover)]">
                    {isCreating ? "Create QCM" : "Modify QCM"}
                  </Button>
                </div>
            )}

          </form>
        </CardContent>
      </Card>
  );
}