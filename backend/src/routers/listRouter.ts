import { Router } from "express";
import {
  createList,
  getLists,
  getListsById,
  updateList,
  deleteList,
} from "../controllers/listController";

const router = Router();

router.post("/boards/:boardId/lists", createList);

router.get("/boards/:boardId/lists", getLists);

router.get("/lists/:listId", getListsById);

router.put("/lists/:listId", updateList);

router.delete("/lists/:listId", deleteList);

export default router;
