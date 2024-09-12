import express, { Request, Response } from "express";
import cors from "cors";
import authRouter from "./routers/userRouter"
const app = express();
const PORT = 4000;

app.use(cors());  
app.use(express.json());

app.get("/api/status", (req: Request, res: Response) => {
  res.json({ message: "Backend is running" });
});
app.use("/user",authRouter)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
