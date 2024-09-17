import { Router } from "express";
import { createChecklist, deleteChecklist, getAllChecklists, getChecklistById, updateChecklist } from "../controllers/Card-attached-controllers/checkListController";

const router = Router();

router.post("/cards/:cardId/checklists", createChecklist);

router.get("/cards/:cardId/checklists", getAllChecklists);

router.get("/checklists/:checklistId", getChecklistById);

router.put("/checklists/:checklistId", updateChecklist);

router.delete("/checklists/:checklistId", deleteChecklist);

export default router;
