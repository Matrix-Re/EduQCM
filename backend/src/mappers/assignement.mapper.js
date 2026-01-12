export const mapAssignedQcm = (result) => {
  return {
    assignmentId: result.id,

    qcm: {
      id: result.qcm.id,
      label: result.qcm.label,
    },

    topic: {
      id: result.qcm.topic.id,
      label: result.qcm.topic.label,
    },

    author: {
      id: result.qcm.author.user.id,
      firstname: result.qcm.author.user.firstname,
      lastname: result.qcm.author.user.lastname,
    },

    assignedAt: result.assignment_date,
    completedAt: result.completion_date,
    score: result.score,

    status: result.completion_date ? "completed" : "assigned",
  };
};
