import express from "express";
import {
  createTeam,
  addMember,
  getTeamsForUser,
  deleteTeam,
  deleteMember,
  getTeamMembers,
} from "../controllers/teamController";

const router = express.Router();


router.post("/teams", createTeam);                
router.get("/users/:userId/teams", getTeamsForUser); 
router.delete("/teams/:teamId", deleteTeam);         

router.post("/teams/:teamId/members", addMember);         
router.delete("/teams/:teamId/members/:userId", deleteMember); 
router.get("/teams/:teamId/members", getTeamMembers);     

export default router;
