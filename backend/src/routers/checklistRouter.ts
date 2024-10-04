import { Router } from "express";
import {
  createChecklist,
  deleteChecklist,
  getAllChecklists,
  getChecklistById,
  updateChecklist,
} from "../controllers/Card-attached-controllers/checkListController";
import { verifyToken } from "../middlewares/authMiddleware";

const router = Router();

router.post("/cards/:cardId/checklists", verifyToken, createChecklist);

router.get("/cards/:cardId/checklists", verifyToken, getAllChecklists);

router.get("/checklists/:checklistId", verifyToken, getChecklistById);

router.put("/checklists/:checklistId", verifyToken, updateChecklist);

router.delete("/checklists/:checklistId", verifyToken, deleteChecklist);

export default router;
