import express, { Request, Response, NextFunction } from "express";
import {
  addFood,
  createOffer,
  editOffer,
  getCurrentOrders,
  getFood,
  getOffer,
  getOrderDetails,
  loginVandor,
  processOrder,
  profileVandor,
  updateProfileVandor,
  updateServiceVandor,
  updateVandorCoverImage,
} from "../controllers/VandorController";
import { Authenticate } from "../middlewares";
import multer from "multer";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images"); // Directory where images will be stored
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "_" + file.originalname;
    cb(null, uniqueSuffix); // Appending extension
  },
});

const images = multer({ storage: storage }).array("images", 10);

router.post("/login", loginVandor);

router.use(Authenticate);
router.get("/profile", profileVandor);
router.patch("/profile", updateProfileVandor);
router.patch("/service", updateServiceVandor);
router.patch("/coverimage", images, updateVandorCoverImage);

router.post("/food", images, addFood);
router.get("/foods", getFood);

router.get("/orders", getCurrentOrders);
router.put("/order/:id/process", processOrder);
router.get("/order/:id", getOrderDetails);

router.post("/offer", createOffer);
router.get("/offer", getOffer);
router.put("/edit-offer/:id", editOffer);

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: "hello from vandor" });
});

export { router as VandorRouter };
