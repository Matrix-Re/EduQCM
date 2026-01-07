import { jest } from "@jest/globals";
import jwt from "jsonwebtoken";

// Mock apiError pour avoir des assertions stables
jest.unstable_mockModule("../../src/utils/error.js", () => ({
  apiError: (status, message, details) => ({ status, message, details }),
}));

// Import APRÈS mock
const { authMiddleware } = await import("../../src/middlewares/auth.middleware.js");
const { requireRole } = await import("../../src/middlewares/role.middleware.js");

const createRes = () => {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  return res;
};

describe("Middlewares", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = "test_secret";
  });

  describe("authMiddleware", () => {
    it("should return 401 when no Authorization header", () => {
      const req = { headers: {} };
      const res = createRes();
      const next = jest.fn();

      authMiddleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        status: 401,
        message: "No token provided",
        details: undefined,
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should return 401 when Authorization format is invalid (not Bearer)", () => {
      const req = { headers: { authorization: "Token abc" } };
      const res = createRes();
      const next = jest.fn();

      authMiddleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        status: 401,
        message: "Invalid authorization format",
        details: undefined,
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should return 401 when Bearer token is missing", () => {
      const req = { headers: { authorization: "Bearer" } };
      const res = createRes();
      const next = jest.fn();

      authMiddleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        status: 401,
        message: "Invalid authorization format",
        details: undefined,
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should attach req.user and call next() for a valid token", () => {
      const verifySpy = jest.spyOn(jwt, "verify").mockReturnValue({
        id: 123,
        role: "student",
      });

      const req = { headers: { authorization: "Bearer valid_token" } };
      const res = createRes();
      const next = jest.fn();

      authMiddleware(req, res, next);

      expect(verifySpy).toHaveBeenCalledWith("valid_token", "test_secret");
      expect(req.user).toEqual({ id: 123, role: "student" });

      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledTimes(1);
    });

    it("should return 401 for JsonWebTokenError", () => {
      jest.spyOn(jwt, "verify").mockImplementation(() => {
        const e = new Error("bad token");
        e.name = "JsonWebTokenError";
        throw e;
      });

      const req = { headers: { authorization: "Bearer bad" } };
      const res = createRes();
      const next = jest.fn();

      authMiddleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        status: 401,
        message: "Invalid or expired token",
        details: undefined,
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should return 401 for TokenExpiredError", () => {
      jest.spyOn(jwt, "verify").mockImplementation(() => {
        const e = new Error("expired");
        e.name = "TokenExpiredError";
        throw e;
      });

      const req = { headers: { authorization: "Bearer expired" } };
      const res = createRes();
      const next = jest.fn();

      authMiddleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        status: 401,
        message: "Invalid or expired token",
        details: undefined,
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should return 500 for unexpected errors", () => {
      jest.spyOn(jwt, "verify").mockImplementation(() => {
        throw new Error("boom");
      });

      const req = { headers: { authorization: "Bearer token" } };
      const res = createRes();
      const next = jest.fn();

      authMiddleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: 500,
        message: "boom",
        details: undefined,
      });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe("requireRole(...allowedRoles)", () => {
    it("should return 403 when req.user is missing", () => {
      const middleware = requireRole("teacher");
      const req = {};
      const res = createRes();
      const next = jest.fn();

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        status: 403,
        message: "Access denied",
        details: undefined,
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should return 403 when req.user.role is missing", () => {
      const middleware = requireRole("teacher");
      const req = { user: {} };
      const res = createRes();
      const next = jest.fn();

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        status: 403,
        message: "Access denied",
        details: undefined,
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should return 403 when role is not allowed", () => {
      const middleware = requireRole("teacher");
      const req = { user: { role: "student" } };
      const res = createRes();
      const next = jest.fn();

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        status: 403,
        message: "Insufficient permissions",
        details: undefined,
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should call next() when role is allowed", () => {
      const middleware = requireRole("teacher");
      const req = { user: { role: "teacher" } };
      const res = createRes();
      const next = jest.fn();

      middleware(req, res, next);

      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledTimes(1);
    });

    it("should allow multiple roles", () => {
      const middleware = requireRole("teacher", "admin");
      const req = { user: { role: "admin" } };
      const res = createRes();
      const next = jest.fn();

      middleware(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
    });
  });
});
