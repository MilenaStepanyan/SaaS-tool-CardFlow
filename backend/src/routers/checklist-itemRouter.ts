import { Router } from "express";
import {
  addItem,
  updateItem,
  getItemById,
  deleteItem,
  getAllItems,
} from "../controllers/Card-attached-controllers/checklistItemsController";
import { verifyToken } from "../middlewares/authMiddleware";

const router = Router();

router.post("/checklists/:checklistId/items", verifyToken, addItem);

router.get("/checklists/:checklistId/items", verifyToken, getAllItems);

router.get("/checklist-items/:itemId", verifyToken, getItemById);

router.put("/checklist-items/:itemId", verifyToken, updateItem);

router.delete("/checklist-items/:itemId", verifyToken, deleteItem);

export default router;
