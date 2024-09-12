import { Router } from "express";
import {
  createBoard,
  deleteBoardById,
  getBoard,
  getBoardById,
} from "../controllers/boardController";
import { verifyToken } from "../middlewares/authMiddleware";

const router = Router();

router.post("/create", verifyToken, createBoard);
router.get("/get", verifyToken, getBoard);
router.get("/:boardId", getBoardById);
router.delete("/:boardId", deleteBoardById);
export default router;
