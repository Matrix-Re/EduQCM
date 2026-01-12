import jwt from "jsonwebtoken";
import crypto from "crypto";

export const generateToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

export function generateRefreshToken() {
  return crypto.randomBytes(64).toString("hex");
}

export const setRefreshTokenCookie = (res, token) => {
  res.cookie("refresh_token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
};
