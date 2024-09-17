import express, { Request, Response } from "express";
import cors from "cors";
import authRouter from "./routers/userRouter";
import boardRouter from "./routers/boardRouter";
import listRouter from "./routers/listRouter";
import cardRouter from "./routers/cardRouter";
import commentRouter from "./routers/commentRouter";
const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

app.get("/api/status", (req: Request, res: Response) => {
  res.json({ message: "Backend is running" });
});
app.use("/api/user", authRouter);
app.use("/api/board", boardRouter);
app.use("/api", listRouter);
app.use("/api", cardRouter);
app.use("/api", commentRouter);
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
