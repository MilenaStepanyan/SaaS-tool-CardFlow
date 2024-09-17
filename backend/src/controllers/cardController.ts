import { Request, Response } from "express";
import { STATUS_CODES } from "../utils/statusCodes";
import promisePool from "../pool-connection/database";
import { ResultSetHeader } from "mysql2";
import { RowDataPacket } from "mysql2";
import { OkPacket } from "mysql2";

export const createCard = async (
  req: Request,
  res: Response
): Promise<Response> => {
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
  } catch (error) {
    console.log(error);
    return res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ msg: "Server Error" });
  }
};
export const getAllCards = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { listId } = req.params;
    if (!listId) {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ msg: "Missing required field list Id" });
    }
    const [listExist] = await promisePool.query<RowDataPacket[]>(
      `SELECT id FROM lists WHERE id = ?`,
      [listId]
    );
    if (listExist.length === 0) {
      return res
        .status(STATUS_CODES.NOT_FOUND)
        .json({ msg: "list does not exist" });
    }
    const [rows]: [RowDataPacket[], any] = await promisePool.query(
      `SELECT * FROM cards WHERE list_id = ?`,
      [listId]
    );
    return res.status(STATUS_CODES.OK).json({ cards: rows || [] });
  } catch (error) {
    console.log(error);
    return res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ msg: "Server Error" });
  }
};
export const getCardById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { cardId } = req.params;
    const [rows]: [RowDataPacket[], any] = await promisePool.query(
      `SELECT * FROM cards WHERE id=?`,
      [cardId]
    );
    if (rows.length === 0) {
      return res
        .status(STATUS_CODES.NOT_FOUND)
        .json({ msg: "Card does not exist" });
    }
    return res.status(STATUS_CODES.OK).json({ card: rows[0] });
  } catch (error) {
    console.log(error);
    return res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ msg: "Server Error" });
  }
};
export const updateCard = async (req: Request, res: Response):Promise<Response> => {
  try {
    const { cardId } = req.params;
    const { title, description } = req.body;
    if (!title) {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ msg: "Missing required fields" });
    }
    const [result] = await promisePool.query<ResultSetHeader>(
      `UPDATE cards SET name = ?,description = ?, updated_at = NOW() WHERE id = ?`,
      [title, description || null, cardId]
    );
    if (result.affectedRows === 0) {
      return res.status(STATUS_CODES.NOT_FOUND).json({ msg: "Card not found" });
    }
    return res
      .status(STATUS_CODES.OK)
      .json({ msg: "Card updated successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ msg: "Server Error" });
  }
};
export const deleteCard = async(req:Request,res:Response):Promise<Response>=>{
    try{
        const {cardId} = req.params
        const [result] = await promisePool.query<ResultSetHeader>(
            `DELETE FROM cards WHERE id = ?`,
            [cardId] 
        )
        if(result.affectedRows===0){
            return res.status(STATUS_CODES.NOT_FOUND).json({msg:"Card not found"})
        }
        return res.status(STATUS_CODES.OK).json({msg:"Card deleted successfully"})
    }catch(error){
        console.log(error);
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({msg:"Server Error"})
    }
}