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
export const deleteTeam = async (req: Request, res: Response) => {
  const { teamId } = req.params;
  const { ownerId } = req.body;
  try {
    const [teamCheck]: [RowDataPacket[], any] = await promisePool.query(
      `SELECT owner_id FROM teams WHERE id = ?`,
      [teamId]
    );

    if (teamCheck.length === 0) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        msg: "Team not found",
      });
    }
    if (teamCheck[0].owner_id !== ownerId) {
      return res.status(STATUS_CODES.UNAUTHORIZED).json({
        msg: "Only the team owner can delete the team",
      });
    }

    await promisePool.query(`DELETE FROM team_members WHERE team_id = ?`, [
      teamId,
    ]);

    const [rows]: [ResultSetHeader, any] = await promisePool.query(
      `DELETE FROM teams WHERE id = ?`,
      [teamId]
    );

    if (rows.affectedRows === 0) {
      return res.status(STATUS_CODES.NOT_FOUND).json({ msg: "Team not found" });
    }
    return res
      .status(STATUS_CODES.OK)
      .json({ msg: "Team deleted successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ msg: "Server Error" });
  }
};
export const deleteMember = async (req: Request, res: Response) => {
  const { teamId, userId } = req.params;
  const { requestingUserId } = req.body;

  try {
    const [adminCheck]: [RowDataPacket[], any] = await promisePool.query(
      `SELECT role FROM team_members WHERE team_id = ? AND user_id = ?`,
      [teamId, requestingUserId]
    );

    if (adminCheck.length === 0 || adminCheck[0].role !== "admin") {
      return res.status(STATUS_CODES.UNAUTHORIZED).json({
        msg: "Only admins can remove members",
      });
    }

    const [memberCheck]: [RowDataPacket[], any] = await promisePool.query(
      `SELECT id FROM team_members WHERE team_id = ? AND user_id = ?`,
      [teamId, userId]
    );

    if (memberCheck.length === 0) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        msg: "Member not found in the team",
      });
    }

    await promisePool.query(
      `DELETE FROM team_members WHERE team_id = ? AND user_id = ?`,
      [teamId, userId]
    );

    return res.status(STATUS_CODES.OK).json({
      msg: "Member removed successfully from the team",
    });
  } catch (error) {
    console.log(error);
    return res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ msg: "Server Error"});
  }
};
export const getTeamMembers = async (req: Request, res: Response) => {
    const { teamId } = req.params;
  
    try {
      const [members]: [RowDataPacket[], any] = await promisePool.query(
        `SELECT tm.user_id, tm.role, u.name AS user_name
         FROM team_members tm
         JOIN users u ON tm.user_id = u.id
         WHERE tm.team_id = ?`,
        [teamId]
      );
  
      if (members.length === 0) {
        return res
          .status(STATUS_CODES.NOT_FOUND)
          .json({ msg: "No members found for this team" });
      }
  
      return res.status(STATUS_CODES.OK).json({ members });
    } catch (error) {
      console.log(error);
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json({ msg: "Server Error" });
    }
  };
  