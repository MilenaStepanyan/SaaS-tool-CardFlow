import { Router } from "express";
import { addComment, deleteComment, editComment, getAllComments } from "../controllers/Card-attached-controllers/commentController";



const router = Router();

router.post("/cards/:cardId/comments", addComment);

router.get("/cards/:cardId/comments", getAllComments);

router.put("/comments/:commentId", editComment);

router.delete("/comments/:commentId", deleteComment);

export default router;
