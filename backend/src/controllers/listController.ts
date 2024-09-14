import { STATUS_CODES } from "../utils/statusCodes";
import promisePool from "../pool-connection/database";
import { Request, Response } from "express";
import { ResultSetHeader } from "mysql2";
import { RowDataPacket } from "mysql2";
import { OkPacket } from "mysql2";

export const createList = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { title } = req.body;
    const { boardId } = req.params;
    if (!title) {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ msg: "Missing required fields" });
    }
    const [result] = await promisePool.query<ResultSetHeader>(
      `INSERT INTO lists (name, board_id, created_at, updated_at) VALUES (?, ?, NOW(), NOW())`,
      [name, boardId]
    );
    return res.status(STATUS_CODES.CREATED).json({ listId: result.insertId });
  } catch (Error) {
    console.log(Error);
    return res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ msg: "Server error" });
  }
};

export const getLists = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { boardId } = req.params;

    const [rows]: [RowDataPacket[], any] = await promisePool.query(
      `SELECT * FROM lists WHERE board_id = ?`,
      [boardId]
    );

    return res.status(STATUS_CODES.OK).json({ lists: rows });
  } catch (Error) {
    console.log(Error);
   return res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ msg: "Server error" });
  }
};

export const getListsById = async (
  req: Request,
  res: Response
) => {
  try {
   //
  } catch (Error) {
    console.log(Error);
   return res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ msg: "Server error" });
  }
};

