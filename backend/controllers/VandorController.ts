import { Request, Response, NextFunction } from "express";
import { foundVandor } from "./AdminController";
import { EditVandor, LoginVandorInput } from "../dto";
import { GenerateSignature, matchedPassword } from "../utility";
import { CreateFoodInput } from "../dto/Food.dto";
import { Food } from "../models";

export const loginVandor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = <LoginVandorInput>req.body;
  const existingVandor = await foundVandor("", email);
  if (existingVandor !== null) {
    const isMatched = await matchedPassword(
      existingVandor.password,
      password,
      existingVandor.salt
    );
    if (isMatched) {
      const signature = GenerateSignature({
        _id: existingVandor.id,
        email: existingVandor.email,
        password: existingVandor.password,
        foodTypes: existingVandor.foodType,
      });

      return res.json(signature);
    } else {
      return res.json({ message: "Invalid credential" });
    }
  } else {
    return res.json({ message: "Credentials are not valid" });
  }
};

export const profileVandor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (user) {
    const existingVandor = await foundVandor(user._id);
    return res.json(existingVandor);
  } else {
    return res.json("Vandor not found");
  }
};

export const updateProfileVandor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, address, phone, foodTypes } = <EditVandor>req.body;
  const user = req.user;
  if (user) {
    const existingVandor = await foundVandor(user._id);
    if (existingVandor !== null) {
      existingVandor.name = name;
      existingVandor.phone = phone;
      existingVandor.address = address;
      existingVandor.foodType = foodTypes;

      const saveResult = await existingVandor.save();
      return res.json(saveResult);
    }
  } else {
    return res.json({ message: "Vandor information not found" });
  }
};
export const updateVandorCoverImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user) {
    const existingVandor = await foundVandor(user._id);
    if (existingVandor !== null) {
      const files = req.files as [Express.Multer.File];
      const images = files?.map((file: Express.Multer.File) => file.filename);
      existingVandor.coverImages.push(...images);
      const result = await existingVandor.save();
      return res.json(result);
    }
  } else {
    return res.json({ message: "Vandor food not found" });
  }
};

export const updateServiceVandor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (user) {
    const existingVandor = await foundVandor(user._id);
    if (existingVandor !== null) {
      existingVandor.serviceAvailable = !existingVandor.serviceAvailable;
      const saveResult = await existingVandor.save();
      return res.json(saveResult);
    }
  } else {
    return res.json({ message: "Vandor information not found" });
  }
};

export const addFood = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, description, category, price, readyTime, foodType } = <
    CreateFoodInput
  >req.body;

  const user = req.user;

  if (user) {
    const existingVandor = await foundVandor(user._id);
    if (existingVandor !== null) {
      const files = req.files as [Express.Multer.File];
      
      const images = files.map((file: Express.Multer.File) => file.filename);

      const createFood = await Food.create({
        vandorId: existingVandor._id,
        name: name,
        description: description,
        category: category,
        price: price,
        readyTime: readyTime,
        foodType: foodType,
        images: images,
        rating: 0,
      });

      existingVandor.foods.push(createFood);
      const result = await existingVandor.save();
      return res.json(result);
    }
  } else {
    return res.json({ message: "Vandor food not found" });
  }
};

export const getFood = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user) {
    const existingVandor = await foundVandor(user._id);
    if (existingVandor !== null) {
      const foods = await Food.find({ vandorId: existingVandor._id });
      if (foods != null) {
        return res.json(foods);
      }
    }
  } else {
    return res.json({ message: "Vandor foods not found" });
  }
};
