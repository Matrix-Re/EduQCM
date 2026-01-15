export const mapProposal = (proposal, showCorrect = false) => ({
  id: proposal.id,
  label: proposal.label,
  ...(showCorrect && { is_correct: proposal.is_correct }),
});
