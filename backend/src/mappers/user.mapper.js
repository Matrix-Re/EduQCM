export function mapUser(user) {
  if (user.student) {
    const { id, ...student } = user.student;
    return {
      id: user.id,
      lastname: user.lastname,
      firstname: user.firstname,
      username: user.username,
      role: "student",
      student,
    };
  }

  if (user.teacher) {
    const { id, ...teacher } = user.teacher;

    return {
      id: user.id,
      lastname: user.lastname,
      firstname: user.firstname,
      username: user.username,
      role: "teacher",
      teacher,
    };
  }

  return {
    id: user.id,
    lastname: user.lastname,
    firstname: user.firstname,
    username: user.username,
    role: "unknown",
  };
}
