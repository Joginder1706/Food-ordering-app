import express, { Request, Response, NextFunction } from "express";
import {
  createAccount,
  createCart,
  createOrder,
  customerLogin,
  customerVerify,
  deleteCart,
  editCustomerProfile,
  getAllOrders,
  getCart,
  getCartById,
  getCustomerProfile,
  getOrderById,
  requestOtpNumber,
} from "../controllers";
import { Authenticate } from "../middlewares";

const router = express.Router();

/* ----------------------- signup --------------------------*/
router.post("/signup", createAccount);

/* ----------------------- login --------------------------*/
router.post("/login", customerLogin);

/* ----------------------- verify customer account --------------------------*/
router.use(Authenticate);

router.patch("/verify", customerVerify);

/* ----------------------- otp requesting --------------------------*/
router.get("/otp", requestOtpNumber);

/* ----------------------- profile --------------------------*/
router.get("/profile", getCustomerProfile);

/* -----------------------update profile --------------------------*/
router.patch("/profile", editCustomerProfile);

/* ----------------------- Cart Section --------------------------*/
router.post("/cart", createCart);

router.get("/cart", getCart);

router.get("/cart/:id", getCartById);

router.delete("/delete", deleteCart);
/* ----------------------- createOrder --------------------------*/
router.post("/createorder", createOrder);

/* -----------------------get all orders --------------------------*/
router.get("/orders", getAllOrders);

/* ----------------------- get order by id --------------------------*/
router.get("/order/:id", getOrderById);

export { router as CustomerRouter };
