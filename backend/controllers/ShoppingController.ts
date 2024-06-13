import { Request, Response, NextFunction } from "express";
import { FoodDoc, Vandor } from "../models";

export const getFoodAvailability = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const pincode = req.params.pincode;
  const result = await Vandor.find({
    pincode: pincode,
    serviceAvailable: true,
  })
    .sort([["rating", "descending"]])
    .populate("foods");

  if (result?.length > 0) {
    return res.status(200).send(result);
  }
  return res.status(400).send({ message: "Data not found!" });
};

export const getTopRestaurants = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const pincode = req.params.pincode;
  const result = await Vandor.find({
    pincode: pincode,
    serviceAvailable: true,
  })
    .sort([["rating", "descending"]])
    .limit(10);

  if (result?.length > 0) {
    return res.status(200).send(result);
  }
  return res.status(400).send({ message: "Data not found!" });
};

export const getFoodIn30Min = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const pincode = req.params.pincode;
  const result = await Vandor.find({
    pincode: pincode,
    serviceAvailable: true,
  }).populate("foods");

  if (result?.length > 0) {
    let foodResult: any = [];
    result.map((vandor) => {
      const foods = vandor.foods as [FoodDoc];
      foodResult.push(...foods.filter((food) => food.readyTime <= 30));
    });

    return res.status(200).send(foodResult);
  }
  return res.status(400).send({ message: "Data not found!" });
};

export const getFoods = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const pincode = req.params.pincode;
  const result = await Vandor.find({
    pincode: pincode,
    serviceAvailable: true,
  }).populate("foods");

  if (result?.length > 0) {
    let foodResult: any = [];
    result.map((vandor) => {
      foodResult.push(...vandor.foods);
    });

    return res.status(200).send(foodResult);
  }
  return res.status(400).send({ message: "Data not found!" });
};

export const getRestaurantById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;
  try {
    const result = await Vandor.findById(id).populate("foods");

    if (result) {
      return res.status(200).send(result);
    } else {
      return res.status(400).send({ message: "Data not found!" });
    }
  } catch (error) {
    return res.status(400).send({ message: "Something went wrong!" });
  }
};
