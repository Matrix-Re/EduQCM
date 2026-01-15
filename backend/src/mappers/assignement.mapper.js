export const mapAssignedQcm = (session) => {
  return {
    assignmentId: session.id,

    qcm: {
      id: session.qcm.id,
      label: session.qcm.label,
    },

    topic: {
      id: session.qcm.topic.id,
      label: session.qcm.topic.label,
    },

    author: {
      id: session.qcm.author.user.id,
      firstname: session.qcm.author.user.firstname,
      lastname: session.qcm.author.user.lastname,
    },

    assignedAt: session.assignment_date,
    completedAt: session.completion_date,
    score: session.score,

    status: session.completion_date ? "completed" : "assigned",
  };
};
