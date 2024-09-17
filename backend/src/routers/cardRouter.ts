import { Router } from "express";
import {
  createCard,
  deleteCard,
  getAllCards,
  getCardById,
  updateCard,
} from "../controllers/cardController";

const router = Router();

router.post("/lists/:listId/cards", createCard);

router.get("/lists/:listId/cards", getAllCards);

router.get("/cards/:cardId", getCardById);

router.put("/cards/:cardId", updateCard);

router.delete("/cards/:cardId", deleteCard);

export default router;
