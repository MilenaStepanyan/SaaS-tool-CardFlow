import { STATUS_CODES } from "../utils/statusCodes";
import promisePool from "../pool-connection/database";
import { Request, Response } from "express";
import { ResultSetHeader } from "mysql2";
import { RowDataPacket } from "mysql2";

export const createTeam = async (req: Request, res: Response) => {
  const { name, description, ownerId } = req.body;
  try {
    const [result]: [ResultSetHeader, any] = await promisePool.query(
      `INSERT INTO teams  (name,description,owner_id) VALUES (?, ?, ?)`,
      [name, description || null, ownerId]
    );
    const teamId = result.insertId;

    await promisePool.query(
      `INSERT INTO team_members (team_id, user_id, role) VALUES (?, ?, 'admin')`,
      [teamId, ownerId]
    );

    return res.status(STATUS_CODES.CREATED).json({
      msg: "Team created successfully",
      teamId: teamId,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ msg: "Server Error" });
  }
};
export const addMember = async (req: Request, res: Response) => {
  try {
  } catch (error) {
    console.log(error);
    return res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ msg: "Server Error" });
  }
};
