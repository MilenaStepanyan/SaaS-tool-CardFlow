import { Router } from "express";
import {
  addItem,
  updateItem,
  getItemById,
  deleteItem,
  getAllItems,
} from "../controllers/Card-attached-controllers/checklistItemsController";

const router = Router();

router.post("/checklists/:checklistId/items", addItem);

router.get("/checklists/:checklistId/items", getAllItems);

router.get("/checklist-items/:itemId", getItemById);

router.put("/checklist-items/:itemId", updateItem);

router.delete("/checklist-items/:itemId", deleteItem);

export default router;
