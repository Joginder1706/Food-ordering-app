import express, { Request, Response, NextFunction } from "express";

const router = express.Router();

/* ----------------------- signup --------------------------*/
router.post("/signup");

/* ----------------------- login --------------------------*/
router.post("/login");

/* ----------------------- verify customer account --------------------------*/
router.patch("/verify");

/* ----------------------- otp requesting --------------------------*/
router.patch("/otp");

/* ----------------------- profile --------------------------*/
router.get("/profile");

router.patch("/profile");

export { router as CustomerRouter };
