import { mapProposal } from "./proposal.mapper.js";

export const mapQuestion = (question) => ({
  id: question.id,
  label: question.label,
  proposals: (question.proposals ?? []).map(mapProposal),
});
