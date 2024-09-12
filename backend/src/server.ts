import express, { Request, Response } from "express";
import cors from "cors";

const app = express();
const PORT = 4000;

app.use(cors());  
app.use(express.json());

app.get("/api/status", (req: Request, res: Response) => {
  res.json({ message: "Backend is running" });
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
