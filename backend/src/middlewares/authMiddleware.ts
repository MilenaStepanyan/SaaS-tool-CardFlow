import { Request, Response, NextFunction } from "express";
import { STATUS_CODES } from "../utils/statusCodes";
import jwt, { JwtPayload } from "jsonwebtoken";

const secret_key = process.env.JWT_SECRET;
if (!secret_key) {
  throw new Error("Secret Key Required");
}
declare global {
  namespace Express {
    interface Request {
      user?: string;
    }
  }
}

interface CustomJwtPayload extends JwtPayload {
  userId: string;
}

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.header("Authorization");
  const token = authHeader?.replace("Bearer ", "").trim();

  if (!token) {
    return res
      .status(STATUS_CODES.UNAUTHORIZED)
      .json({ msg: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, secret_key) as CustomJwtPayload;

    req.user = decoded.userId;

    next();
  } catch (error: unknown) {
    if (error instanceof jwt.TokenExpiredError) {
      return res
        .status(STATUS_CODES.UNAUTHORIZED)
        .json({ msg: "Token has expired" });
    } else if (error instanceof jwt.JsonWebTokenError) {
      return res
        .status(STATUS_CODES.UNAUTHORIZED)
        .json({ msg: "Token is not valid" });
    }

    console.error("Unexpected Error:", error);
    return res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ msg: "Server error" });
  }
};
