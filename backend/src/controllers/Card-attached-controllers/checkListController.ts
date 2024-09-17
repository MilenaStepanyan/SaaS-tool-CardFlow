import { Request, Response } from "express";
import { STATUS_CODES } from "../../utils/statusCodes";
import promisePool from "../../pool-connection/database";
import { ResultSetHeader } from "mysql2";
import { RowDataPacket } from "mysql2";

export const createChecklist = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const { name } = req.body;
      const { cardId } = req.params;
      if (!name || !cardId) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json({ msg: "Missing required fields" });
      }
      const [cardExist] = await promisePool.query<RowDataPacket[]>(
        `SELECT id FROM cards WHERE id = ?`,
        [cardId]
      );
  
      if (cardExist.length === 0) {
        return res.status(STATUS_CODES.NOT_FOUND).json({ msg: "Card not found" });
      }
      const [result] = await promisePool.query<ResultSetHeader>(
        `INSERT INTO checklists (name,card_id, created_at) VALUES (?, ?, NOW())`,
        [name,cardId]
      );
      return res.status(STATUS_CODES.CREATED).json({ checklistId: result.insertId });
    } catch (error) {
      console.log(error);
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json({ msg: "Server Error" });
    }
  };
  export const getAllChecklists = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { cardId } = req.params;
    if (!cardId) {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ msg: "Missing required field:cardId" });
    }
    const [cardExist] = await promisePool.query<RowDataPacket[]>(
      `SELECT id FROM cards WHERE id = ?`,
      [cardId]
    );
    if (cardExist.length === 0) {
      return res
        .status(STATUS_CODES.NOT_FOUND)
        .json({ msg: "Card does not exist" });
    }
    const [rows]: [RowDataPacket[], any] = await promisePool.query(
      `SELECT * FROM checklists WHERE card_id = ?`,
      [cardId]
    );
    return res.status(STATUS_CODES.OK).json({ checklists: rows || [] });
  } catch (error) {
    console.log(error);
    return res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ msg: "Server Error" });
  }
};

export const getChecklistById = async (
    req: Request,
    res: Response
  ) => {
   //
  };