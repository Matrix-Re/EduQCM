export const mapQcm = (qcm) => {
    return {
        id: qcm.id,
        label: qcm.label,

        topic: {
            id: qcm.topic.id,
            label: qcm.topic.label
        },

        author: {
            id: qcm.author.user.id,
            firstname: qcm.author.user.firstname,
            lastname: qcm.author.user.lastname,
            username: qcm.author.user.username
        },

        createdAt: qcm.created_at,
        updatedAt: qcm.updated_at
    };
};

export const mapQcmLight = (qcm) => {
    return {
        id: qcm.id,
        label: qcm.label,
    };
}