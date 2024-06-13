import express, { Request, Response, NextFunction } from "express";
import { createVandor, getVandor, getVandorById } from "../controllers";
const router = express.Router();
router.post("/vandor", createVandor);
router.get("/vandor", getVandor);
router.get("/vandor/:id", getVandorById);

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: "hello from admin" });
});

export { router as AdminRouter };
