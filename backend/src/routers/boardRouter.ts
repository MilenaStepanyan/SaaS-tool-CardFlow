import { Router } from "express";
import { createBoard, getBoard } from "../controllers/boardController";
import { verifyToken } from "../middlewares/authMiddleware";

const router = Router();

router.post("/create", verifyToken, createBoard);
router.get("/get", verifyToken, getBoard);
export default router