// src/controllers/descriptionController.ts
import { Request, Response } from "express";
import { STATUS_CODES } from "../../utils/statusCodes";
import promisePool from "../../pool-connection/database";
import { ResultSetHeader } from "mysql2";
import { RowDataPacket } from "mysql2";

// Add a new description
export const addDescription = async (
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
      `INSERT INTO descriptions (description, card_id, created_at) VALUES (?, ?, NOW())`,
      [content, cardId]
    );

    return res.status(STATUS_CODES.CREATED).json({
      descriptionId: result.insertId,
      msg: "Description created successfully",
    });
  } catch (error) {
    console.error(error);
    return res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ msg: "Server Error" });
  }
};

// Get the description
export const getDescription = async (
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
        .json({ msg: "Card does not exist" });
    }

    const [rows]: [RowDataPacket[], any] = await promisePool.query(
      `SELECT * FROM descriptions WHERE card_id = ? LIMIT 1`,
      [cardId]
    );

    return res.status(STATUS_CODES.OK).json({ descriptions: rows });
  } catch (error) {
    console.error(error);
    return res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ msg: "Server Error" });
  }
};


export const editDescription = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { descriptionId } = req.params;
    const { description } = req.body;
    if (!description) {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ msg: "Missing required fields" });
    }
    const [result] = await promisePool.query<ResultSetHeader>(
      `UPDATE descriptions SET description = ?, updated_at = NOW() WHERE id = ?`,
      [description, descriptionId]
    );
    if (result.affectedRows === 0) {
      return res
        .status(STATUS_CODES.NOT_FOUND)
        .json({ msg: "Description not found" });
    }
    return res
      .status(STATUS_CODES.OK)
      .json({ msg: "Description edited successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ msg: "Server Error" });
  }
};

// Delete a description
export const deleteDescription = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { descriptionId } = req.params;
    const [descriptionExist] = await promisePool.query<RowDataPacket[]>(
      `SELECT id FROM descriptions WHERE id = ?`,
      [descriptionId]
    );

    if (descriptionExist.length === 0) {
      return res
        .status(STATUS_CODES.NOT_FOUND)
        .json({ msg: "Description not found" });
    }

    const [result] = await promisePool.query<ResultSetHeader>(
      `DELETE FROM descriptions WHERE id = ?`,
      [descriptionId]
    );
    if (result.affectedRows === 0) {
      return res
        .status(STATUS_CODES.NOT_FOUND)
        .json({ msg: "Description not found" });
    }
    return res
      .status(STATUS_CODES.OK)
      .json({ msg: "Description deleted successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ msg: "Server Error" });
  }
};
