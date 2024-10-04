import { Router } from "express";
import {
  createList,
  getLists,
  getListsById,
  updateList,
  deleteList,
} from "../controllers/listController";
import { verifyToken } from "../middlewares/authMiddleware";

const router = Router();

router.post("/boards/:boardId/lists",verifyToken, createList);

router.get("/boards/:boardId/lists",verifyToken, getLists);

router.get("/lists/:listId",verifyToken, getListsById);

router.put("/lists/:listId", verifyToken,updateList);

router.delete("/lists/:listId", verifyToken, deleteList);

export default router;
