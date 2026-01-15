import { mapProposal } from "./proposal.mapper.js";

export const mapQuestion = (question, showCorrect = false) => ({
  id: question.id,
  label: question.label,
  proposals: (question.proposals ?? []).map((p) => mapProposal(p, showCorrect)),
});
