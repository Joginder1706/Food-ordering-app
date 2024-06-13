import { Request, Response, NextFunction } from "express";
import { CreateVandorInput } from "../dto";
import { Vandor } from "../models";
import { GeneratePassword, GenerateSalt } from "../utility";

export const foundVandor = async (id: string | undefined, email?: string) => {
  if (email) {
    return await Vandor.findOne({ email: email });
  } else {
    return await Vandor.findById(id);
  }
};

export const createVandor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    name,
    ownerName,
    foodType,
    pincode,
    address,
    phone,
    email,
    password,
  } = <CreateVandorInput>req.body;

  const existingVandor = await foundVandor("", email);
  if (existingVandor !== null) {
    return res.json({ message: "Vandor is aleady present" });
  }

  //generate salt
  const salt = await GenerateSalt();
  //generate password
  const hashPassword = await GeneratePassword(password, salt);

  const createdVandor = await Vandor.create({
    name: name,
    ownerName: ownerName,
    foodType: foodType,
    pincode: pincode,
    address: address,
    phone: phone,
    email: email,
    password: hashPassword,
    salt: salt,
    rating: 0,
    serviceAvailable: false,
    coverImages: [],
    foods: [],
  });

  return res.json(createdVandor);
};

export const getVandor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const vandors = await Vandor.find();
  if (vandors !== null) {
    return res.json(vandors);
  } else {
    return res.json({ message: "No vandor found" });
  }
};

export const getVandorById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const vandorId = req.params.id;
  const singleVandor = await foundVandor(vandorId);
  if (singleVandor !== null) {
    return res.json(singleVandor);
  } else {
    return res.json({ message: "No vandor found" });
  }
};
