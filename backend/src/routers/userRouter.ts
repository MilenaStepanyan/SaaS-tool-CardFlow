import express from "express";
import { Request, Response } from "express";
import { loginUser, registerUser } from "../controllers/userController";

const router = express.Router();

router.post("/register",(req:Request,res:Response)=>registerUser(req,res))
router.post("/login",(req:Request,res:Response)=>loginUser(req,res))
export default router