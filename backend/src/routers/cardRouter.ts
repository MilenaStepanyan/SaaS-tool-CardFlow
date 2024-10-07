import { Router } from "express";
import {
  createCard,
  deleteCard,
  getAllCards,
  getCardById,
  updateCard,
} from "../controllers/cardController";
import { verifyToken } from "../middlewares/authMiddleware";

const router = Router();

router.post("/lists/:listId/cards", verifyToken, createCard);
router.get("/lists/:listId/cards", verifyToken, getAllCards);
router.get("/cards/:cardId", verifyToken, getCardById);
router.put("/cards/:cardId", verifyToken, updateCard);
router.delete("/cards/:cardId", verifyToken, deleteCard);

export default router;
