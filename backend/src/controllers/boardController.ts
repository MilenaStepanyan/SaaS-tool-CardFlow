import { STATUS_CODES } from "../utils/statusCodes";
import promisePool from "../pool-connection/database";
import { Request, Response } from "express";
import { ResultSetHeader } from "mysql2";
import { RowDataPacket } from "mysql2";

export const createBoard = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { title, description } = req.body;
    const userId = req.user;
    if (!title) {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ msg: "Missing required fields" });
    }
    const [result] = await promisePool.query<ResultSetHeader>(
      `INSERT INTO boards (name, description, created_by, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())`,
      [title, description || "", userId]
    );
    return res
      .status(STATUS_CODES.CREATED)
      .json({ msg: "Board created successfully", boardId: result.insertId });
  } catch (error) {
    console.log(error);
    return res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ msg: "Server error" });
  }
};
export const getBoard = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const userId:any =req.user
    const [boards] = await promisePool.query<RowDataPacket[]>(
      `SELECT * FROM boards WHERE created_by = ?`,
      [req.user]
    );

    return res.status(STATUS_CODES.OK).json(boards);
  } catch (error) {
    console.log(error);
    return res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ message: "Error fetching boards" });
  }
};
export const getBoardById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { boardId } = req.params;

    const [boardRows] = await promisePool.query<RowDataPacket[]>(
      `SELECT * FROM boards WHERE id = ? LIMIT 1`,
      [boardId]
    );

    if (boardRows.length === 0) {
      return res
        .status(STATUS_CODES.NOT_FOUND)
        .json({ msg: "Board not found" });
    }

    const board = boardRows[0];

    const [listRows] = await promisePool.query<RowDataPacket[]>(
      `SELECT * FROM lists WHERE board_id = ?`,
      [boardId]
    );

    return res
      .status(STATUS_CODES.OK)
      .json({ board: { ...board, lists: listRows } });
  } catch (error) {
    console.log(error);
    return res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ msg: "Server Error" });
  }
};

export const deleteBoardById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { boardId } = req.params;
    const [result] = await promisePool.query<ResultSetHeader>(
      `
    DELETE FROM boards WHERE id =?
    `,
      [boardId]
    );
    if (result.affectedRows === 0) {
      return res
        .status(STATUS_CODES.NOT_FOUND)
        .json({ msg: "Borders not found" });
    }
    return res
      .status(STATUS_CODES.OK)
      .json({ msg: "Board deleted successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ msg: "Server Error" });
  }
};
