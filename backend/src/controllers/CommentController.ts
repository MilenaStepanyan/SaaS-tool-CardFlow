import { Request, Response } from "express";
import { STATUS_CODES } from "../utils/statusCodes";
import promisePool from "../pool-connection/database";
import { ResultSetHeader } from "mysql2";
import { RowDataPacket } from "mysql2";

export const addComment = async (req: Request, res: Response) => {
  try {
    const { cardId } = req.params;
    const { content } = req.body;
    const userId = req.user;
    if (!content || !cardId || !userId) {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ msg: "Missing required fields" });
    }
    const [cardExist]: [RowDataPacket[], any] = await promisePool.query(
      `SELECT id FROM cards WHERE id = ?`,
      [cardId]
    );

    if (cardExist.length === 0) {
      return res.status(STATUS_CODES.NOT_FOUND).json({ msg: "Card not found" });
    }
    const [result] = await promisePool.query<ResultSetHeader>(
      `INSERT INTO comments (content, card_id, user_id, created_at) VALUES (?, ?, ?, NOW())`,
      [content, cardId, userId]
    );
    return res
      .status(STATUS_CODES.CREATED)
      .json({ msg: "Comment added successfully", commentId: result.insertId });
  } catch (error) {
    console.log(error);
    return res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ msg: "Server Error" });
  }
};

export const getAllComments = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { cardId } = req.params;
    if (!cardId) {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ msg: "Missing required field card Id" });
    }
    const [cardExist] = await promisePool.query<RowDataPacket[]>(
      `SELECT id FROM cards WHERE id = ?`,
      [cardId]
    );
    if (cardExist.length === 0) {
      return res
        .status(STATUS_CODES.NOT_FOUND)
        .json({ msg: "card does not exist" });
    }
    const [rows]: [RowDataPacket[], any] = await promisePool.query(
      `SELECT * FROM comments WHERE card_id = ?`,
      [cardId]
    );
    return res.status(STATUS_CODES.OK).json({ comments: rows || [] });
  } catch (error) {
    console.log(error);
    return res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ msg: "Server Error" });
  }
};
