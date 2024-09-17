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
      [title, boardId]
    );
    return res.status(STATUS_CODES.CREATED).json({ listId: result.insertId });
  } catch (error) {
    console.log(error);
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
  } catch (error) {
    console.log(error);
    return res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ msg: "Server error" });
  }
};

export const getListsById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { listId } = req.params;
    const [rows]: [RowDataPacket[], any] = await promisePool.query(
      `SELECT * FROM lists WHERE id = ?`,
      [listId]
    );
    if (rows.length === 0) {
      return res.status(STATUS_CODES.NOT_FOUND).json({ msg: "List not found" });
    }
    return res.status(STATUS_CODES.OK).json({ list: rows[0] });
  } catch (error) {
    console.log(error);
    return res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ msg: "Server error" });
  }
};
export const updateList = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { listId } = req.params;
    const { title } = req.body;

    if (!title) {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ msg: "Missing required fields" });
    }

    const [result] = await promisePool.query<ResultSetHeader>(
      `UPDATE lists SET name = ?, updated_at = NOW() WHERE id = ?`,
      [title, listId]
    );

    if (result.affectedRows === 0) {
      return res.status(STATUS_CODES.NOT_FOUND).json({ msg: "List not found" });
    }

    return res.status(STATUS_CODES.OK).json({ msg: "List updated" });
  } catch (error) {
    console.log(error);
    return res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ msg: "Server error" });
  }
};
export const deleteList = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { listId } = req.params;
    const [rows] = await promisePool.query<ResultSetHeader>(
      `DELETE FROM lists WHERE id = ?`,
      [listId]
    );
    if (rows.affectedRows === 0) {
      return res.status(STATUS_CODES.NOT_FOUND).json({ msg: "List Not Found" });
    }
    return res
      .status(STATUS_CODES.OK)
      .json({ msg: "List deleted successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ msg: "Server Error" });
  }
};
