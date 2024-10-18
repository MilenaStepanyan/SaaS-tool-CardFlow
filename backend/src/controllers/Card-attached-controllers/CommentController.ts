import { Request, Response } from "express";
import { STATUS_CODES } from "../../utils/statusCodes";
import promisePool from "../../pool-connection/database";
import { ResultSetHeader } from "mysql2";
import { RowDataPacket } from "mysql2";

export const addComment = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { content } = req.body;
    const { cardId } = req.params;

    if (!content || !cardId) {
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
      `INSERT INTO comments (content, card_id, created_at) VALUES (?, ?, NOW())`,
      [content, cardId]
    );

    return res.status(STATUS_CODES.CREATED).json({
      commentId: result.insertId,
      msg: "Comment created successfully",
    });
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
export const editComment = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;
    if (!content) {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ msg: "Missing required fields" });
    }
    const [result] = await promisePool.query<ResultSetHeader>(
      `UPDATE comments SET content = ?, updated_at = NOW() WHERE id = ?`,
      [content, commentId]
    );
    if (result.affectedRows === 0) {
      return res
        .status(STATUS_CODES.NOT_FOUND)
        .json({ msg: "comment not found" });
    }
    return res
      .status(STATUS_CODES.OK)
      .json({ msg: "comment edited successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ msg: "Server Error" });
  }
};
export const deleteComment = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { commentId } = req.params;
    const [commentExist] = await promisePool.query<RowDataPacket[]>(
      `SELECT id FROM comments WHERE id = ?`,
      [commentId]
    );

    if (commentExist.length === 0) {
      return res
        .status(STATUS_CODES.NOT_FOUND)
        .json({ msg: "Comment not found" });
    }

    const [result] = await promisePool.query<ResultSetHeader>(
      `DELETE FROM comments WHERE id = ?`,
      [commentId]
    );
    if (result.affectedRows === 0) {
      return res
        .status(STATUS_CODES.NOT_FOUND)
        .json({ msg: "comment not found" });
    }
    return res
      .status(STATUS_CODES.OK)
      .json({ msg: "comment deleted successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ msg: "Server Error" });
  }
};
