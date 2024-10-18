import { Router } from "express";
import {
  addDescription,
  deleteDescription,
  editDescription,
  getDescription,
} from "../controllers/Card-attached-controllers/descriptionController";

const router = Router();

router.post("/cards/:cardId/descriptions", addDescription);

router.get("/cards/:cardId/descriptions", getDescription);

router.put("/descriptions/:descriptionId", editDescription);

router.delete("/descriptions/:descriptionId", deleteDescription);

export default router;
