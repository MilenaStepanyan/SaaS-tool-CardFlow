import promisePool from "../pool-connection/database";
import { Request, Response } from "express";
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
const SECRET_KEY = process.env.JWT_SECRET
if(!SECRET_KEY){
    throw new Error ('Secret Key Required')
}
export const registerUser = async(
    req:Request,res:Response
    ): Promise<Response> =>{
    try{
        const {username,email,password} = req.body
        if(!username||!email||!password){
           return res.status(400).json({msg:"Missing required fields"})
        }
        const hasshedPassword = await bcrypt.hash(password,10)
        await promisePool.query(
            `INSERT INTO users (username,email,password) VALUES (?,?,?)`,
            [username,email,hasshedPassword]
        )
        return res.status(200).json({msg:"User Registered"})
    }catch(Error){
        console.log(Error)
        return res.status(500).json({msg:"Server Error"})
    }
}
export const loginUser = async(req:Request,res:Response)=>{
try{
   //
}catch{
//
}
}