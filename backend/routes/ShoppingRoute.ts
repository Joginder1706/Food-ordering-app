import express, { Request, Response, NextFunction } from "express";
import {
  getFoodAvailability,
  getFoodIn30Min,
  getFoods,
  getRestaurantById,
  getTopRestaurants,
} from "../controllers";
import { Authenticate } from "../middlewares";
const router = express.Router();

// router.use(Authenticate);
/* ----------------------- food availability --------------------------*/
router.get("/:pincode", getFoodAvailability);

/* ----------------------- top restaurent --------------------------*/

router.get("/top-restaurants/:pincode", getTopRestaurants);

/* ----------------------- food available in 30 min --------------------------*/
router.get("/foods-in-30-min/:pincode", getFoodIn30Min);

/* ----------------------- search foods --------------------------*/
router.get("/search/:pincode", getFoods);

/* ----------------------- find restaurent by id --------------------------*/
router.get("/restaurant/:id", getRestaurantById);

export { router as ShoppingRouter };
