import express from "express";
import { Request, Response } from "express";
import { loginUser, registerUser } from "../controllers/userController";

const router = express.Router();

router.post("/register",(req:Request,res:Response)=>registerUser(req,res))

export default router