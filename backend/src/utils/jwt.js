import jwt from 'jsonwebtoken';

export const generateToken = (user) => {
    return jwt.sign(
        { IdUtilisateur: user.IdUtilisateur, role: user.role },
        "test",
        { expiresIn: "7d" }
    );
};
