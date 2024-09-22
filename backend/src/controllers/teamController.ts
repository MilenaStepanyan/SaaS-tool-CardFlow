import { STATUS_CODES } from "../utils/statusCodes";
import promisePool from "../pool-connection/database";
import { Request, Response } from "express";
import { ResultSetHeader } from "mysql2";
import { RowDataPacket } from "mysql2";

export const createTeam = async(Req:Request,res:Response)=>{
    //
}
export const addMember = async(req:Request,res:Response)=>{
    try{

    }catch(error){
        console.log(error);
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({msg:"Server Error"})
    }
}