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
  const { teamId, userId, role } = req.body;
  try {
    const [team]: [RowDataPacket[], any] = await promisePool.query(
      `SELECT id FROM teams WHERE id=?`,
      [teamId]
    );
    if (team.length === 0) {
      return res
        .status(STATUS_CODES.NOT_FOUND)
        .json({ msg: "Team is not found" });
    }
    const [existingMember]: [RowDataPacket[], any] = await promisePool.query(
      `SELECT id FROM team_members WHERE team_id = ? AND user_id = ?`,
      [teamId, userId]
    );
    if (existingMember.length > 0) {
      return res
        .status(STATUS_CODES.CONFLICT)
        .json({ msg: "Member is already in the team" });
    }
    await promisePool.query(
      `INSERT INTO team_members (team_id,user_id,role) VALUES (?, ?, ?)`,
      [teamId, userId, role]
    );
    return res
      .status(STATUS_CODES.CREATED)
      .json({ msg: "Member added successfully to the team" });
  } catch (error) {
    console.log(error);
    return res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ msg: "Server Error" });
  }
};
export const getTeamsForUser = async (req: Request, res: Response) => {
    const { userId } = req.params;
    try {
      const [teams]: [RowDataPacket[], any] = await promisePool.query(
        `SELECT t.id, t.name, t.description 
         FROM teams t 
         JOIN team_members tm ON t.id = tm.team_id
         WHERE tm.user_id = ?`,
        [userId]
      );
  
      if (teams.length === 0) {
        return res
          .status(STATUS_CODES.NOT_FOUND)
          .json({ msg: "No teams found for this user" });
      }
  
      return res.status(STATUS_CODES.OK).json({ teams });
    } catch (error) {
      console.log(error);
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json({ msg: "Server Error" });
    }
  };