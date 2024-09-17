import { Request, Response } from "express";
import { STATUS_CODES } from "../../utils/statusCodes";
import promisePool from "../../pool-connection/database";
import { ResultSetHeader } from "mysql2";
import { RowDataPacket } from "mysql2";

export const addItem = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { checklistId } = req.params;
      const { description } = req.body;
      if (!description || !checklistId) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json({ msg: "Missing required fields" });
      }
  
      const [checklistExist]: [RowDataPacket[], any] = await promisePool.query(
        `SELECT id FROM checklists WHERE id = ?`,
        [checklistId]
      );
  
      if (checklistExist.length === 0) {
        return res.status(STATUS_CODES.NOT_FOUND).json({ msg: "Checklist not found" });
      }
  
      const [result] = await promisePool.query<ResultSetHeader>(
        `INSERT INTO checklist_items (description, checklist_id, created_at) VALUES (?, ?, NOW())`,
        [description, checklistId]
      );
  
      return res
        .status(STATUS_CODES.CREATED)
        .json({ msg: "Checklist item added successfully", itemId: result.insertId });
    } catch (error) {
      console.log(error);
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json({ msg: "Server Error" });
    }
  };
  