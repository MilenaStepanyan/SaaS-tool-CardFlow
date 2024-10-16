import promisePool from "../pool-connection/database";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { STATUS_CODES } from "../utils/statusCodes";
import { RowDataPacket } from "mysql2";
import { User } from "../models/User";

const SECRET_KEY = process.env.JWT_SECRET;
if (!SECRET_KEY) {
  throw new Error("Secret Key Required");
}

export const registerUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ msg: "Missing required fields" });
    }

    const [existingUsers]: [RowDataPacket[], any] = await promisePool.query(
      `SELECT * FROM users WHERE username=? OR email=?`,
      [username, email]
    );
    if (existingUsers.length > 0) {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ msg: "Username or email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await promisePool.query(
      `INSERT INTO users (username,email,password) VALUES (?,?,?)`,
      [username, email, hashedPassword]
    );

    return res.status(STATUS_CODES.CREATED).json({ msg: "User Registered" });
  } catch (error) {
    console.error(error);
    return res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ msg: "Server Error" });
  }
};

export const loginUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ msg: "Missing required fields" });
    }

    const [rows]: [RowDataPacket[], any] = await promisePool.query(
      `SELECT * FROM users WHERE username=?`,
      [username]
    );

    if (rows.length === 0) {
      return res
        .status(STATUS_CODES.NOT_FOUND)
        .json({ msg: "User does not exist" });
    }

    const user: User = rows[0] as User;
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ msg: "Wrong password" });
    }

    const token = jwt.sign({ userId: user.id }, SECRET_KEY, {
      expiresIn: "10h",
    });

    return res.json({
      token,
      user: { id: user.id, username: user.username, email: user.email },
    });
  } catch (error) {
    console.error(error);
    return res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ msg: "Server Error" });
  }
};
