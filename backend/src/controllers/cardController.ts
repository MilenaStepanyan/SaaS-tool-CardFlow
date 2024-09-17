import { Request, Response } from "express";
import { STATUS_CODES } from "../utils/statusCodes";
import promisePool from "../pool-connection/database";
import { ResultSetHeader } from "mysql2";
import { RowDataPacket } from "mysql2";
import { OkPacket } from "mysql2";

export const createCard = async (req: Request, res: Response):Promise<Response> => {
  try {
    const { title, description } = req.body;
    const { listId } = req.params;
    if (!title || !listId) {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ msg: "Missing required fields" });
    }
    const [listExists] = await promisePool.query<RowDataPacket[]>(
      `SELECT id FROM lists WHERE id = ?`,
      [listId]
    );

    if (listExists.length === 0) {
      return res.status(STATUS_CODES.NOT_FOUND).json({ msg: "List not found" });
    }
    const [result] = await promisePool.query<ResultSetHeader>(
      `INSERT INTO cards (name, description,list_id, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())`,
      [title, description || null, listId]
    );
    return res.status(STATUS_CODES.OK).json({ cardId: result.insertId });
  } catch (Error) {
    console.log(Error);
    return res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ msg: "Server Error" });
  }
};
export const getAllCards = async (req:Request,res:Response)=>{
    //
}