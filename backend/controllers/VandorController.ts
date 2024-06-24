import { Request, Response, NextFunction } from "express";
import { foundVandor } from "./AdminController";
import { CreateOfferInputs, EditVandor, LoginVandorInput } from "../dto";
import { GenerateSignature, matchedPassword } from "../utility";
import { CreateFoodInput } from "../dto/Food.dto";
import { Food, Vandor } from "../models";
import { Order } from "../models/Order";
import { Offer } from "../models/Offer";

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

// orders

export const getCurrentOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (user) {
    const orders = await Order.find({ vandorId: user._id }).populate(
      "items.food"
    );
    if (orders) {
      return res.status(201).json(orders);
    }
  } else {
    return res.json({ message: "Order not found" });
  }
};
export const getOrderDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;
  if (id) {
    const order = await Order.findById(id).populate("items.food");
    if (order) {
      return res.status(201).json(order);
    }
  } else {
    return res.json({ message: "Order not found" });
  }
};
export const processOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;
  const { remarks, status, time } = req.body;
  if (id) {
    const order = await Order.findById(id);
    // .populate("items.food");
    if (order) {
      order.orderStatus = status;
      order.remarks = remarks;
      order.readyTime = time;
      const result = await order.save();
      return res.status(201).json(result);
    }
  } else {
    return res.json({ message: "unable to process the order" });
  }
};

//offer

export const createOffer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (user) {
    const {
      offerType,
      title,
      description,
      minValue,
      offerAmount,
      startValidity,
      endValidity,
      promocode,
      promoType,
      bank,
      bins,
      pincode,
      isActive,
    } = <CreateOfferInputs>req.body;
    const vandor = await foundVandor(user._id);

    if (vandor) {
      const offer = await Offer.create({
        offerType,
        vandors: [vandor],
        title,
        description,
        minValue,
        offerAmount,
        startValidity,
        endValidity,
        promocode,
        promoType,
        bank,
        bins,
        pincode,
        isActive,
      });
      return res.status(201).json(offer);
    }
  }
  return res.json({ message: "vandor not found" });
};

export const getOffer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (user) {
    const offers = await Offer.find().populate("vandors");
    let currOffers = Array();
    if (offers?.length > 0) {
      offers.map((item) => {
        if (item.vandors) {
          item.vandors.map((vandor) => {
            if (vandor._id.toString() == user._id) {
              currOffers.push(item);
            }
          });
        }

        if (item.offerType === "GENERIC") {
          currOffers.push(item);
        }
      });
    }
    return res.status(201).json(currOffers);
  }
  return res.status(400).json({ message: "vandor not found" });
};

export const editOffer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  const offerId = req.params.id;
  if (user) {
    const {
      offerType,
      title,
      description,
      minValue,
      offerAmount,
      startValidity,
      endValidity,
      promocode,
      promoType,
      bank,
      bins,
      pincode,
      isActive,
    } = <CreateOfferInputs>req.body;
    let currOffer = await Offer.findById(offerId);
    if (currOffer) {
      const vandor = await foundVandor(user._id);

      if (vandor) {
        currOffer.offerType = offerType;
        currOffer.title = title;
        currOffer.description = description;
        currOffer.minValue = minValue;
        currOffer.offerAmount = offerAmount;
        currOffer.startValidity = startValidity;
        currOffer.endValidity = endValidity;
        currOffer.promocode = promocode;
        currOffer.promoType = promoType;
        currOffer.bank = bank;
        currOffer.bins = bins;
        currOffer.pincode = pincode;
        currOffer.isActive = isActive;
        await currOffer.save();
        return res.status(201).json(currOffer);
      }
    }
  }
  return res.json({ message: "vandor not found" });
};
