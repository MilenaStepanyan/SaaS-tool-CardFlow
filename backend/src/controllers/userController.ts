import promisePool from "../pool-connection/database";
import { Request, Response } from "express";
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

export const registerUser = async(req:Request,res:Response)=>{
    const {username,email,password} = req.body
    if(!username||!email||!password){
        res.status(400).json({msg:"Missing required fields"})
    }
    try{
       //
    }catch(Error){
        console.log(Error)
        res.status(500).json({msg:"Server Error"})
    }
}