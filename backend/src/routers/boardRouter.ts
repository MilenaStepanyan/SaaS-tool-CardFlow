import { Router } from "express";
import { createBoard } from "../controllers/boardController";
import { verifyToken } from "../middlewares/authMiddleware";

const router = Router();

router.post("/", verifyToken, createBoard);
export default router