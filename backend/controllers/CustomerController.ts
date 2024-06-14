import { Request, Response, NextFunction } from "express";
import { validate } from "class-validator";
import { plainToClass } from "class-transformer";
import mongoose from "mongoose";
import {
  EditCustomerInputs,
  LoginCustomerInputs,
  OrderInputs,
  createCustomerInputs,
} from "../dto/Customer.dto";
import {
  GenerateOtp,
  GeneratePassword,
  GenerateSalt,
  GenerateSignature,
  matchedPassword,
  requestOtp,
} from "../utility";
import { Customer, Food } from "../models";
import { Order } from "../models/Order";

export const createAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customerInputs = plainToClass(createCustomerInputs, req.body);
  const inputErrors = await validate(customerInputs, {
    validationError: { target: true },
  });

  if (inputErrors?.length > 0) {
    return res.status(400).json({ error: inputErrors });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { email, phone, password } = customerInputs;
    const isExistingEmail = await Customer.findOne({ email: email });

    if (isExistingEmail !== null) {
      return res.json({ message: "already user present" });
    }

    const salt = await GenerateSalt();
    const userPassword = await GeneratePassword(password, salt);
    const { otp, expiry } = GenerateOtp();

    const newCustomer = new Customer({
      email: email,
      password: userPassword,
      address: "test",
      phone: phone,
      salt: salt,
      firstName: "test",
      lastName: "test",
      verified: false,
      otp: otp,
      otp_expiry: expiry,
      lat: 0,
      lng: 0,
    });

    const result = await newCustomer.save({ session });

    if (!result) {
      throw new Error("Failed to create customer");
    }

    // Send OTP to customer (uncomment and implement requestOtp if you have a method for sending OTP)
    // await requestOtp(otp, phone);

    // Generate signature
    const signature = GenerateSignature({
      _id: result.id,
      email: result.email,
      verified: result.verified,
    });

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      signature: signature,
      email: result.email,
      verified: result.verified,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return res
      .status(400)
      .json({ message: "Account creation failed", error: error });
  }
};

export const customerLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const loginInputs = plainToClass(LoginCustomerInputs, req.body);
  const inputErrors = await validate(loginInputs, {
    validationError: { target: true },
  });

  if (inputErrors?.length > 0) {
    return res.status(400).json({ error: inputErrors });
  }

  const { email, password } = loginInputs;
  const existingUser = await Customer.findOne({ email: email });
  if (existingUser !== null) {
    const isMatched = await matchedPassword(
      existingUser.password,
      password,
      existingUser.salt
    );
    if (isMatched) {
      const signature = GenerateSignature({
        _id: existingUser.id,
        email: existingUser.email,
        verified: existingUser.verified,
      });

      return res.status(201).json({
        signature: signature,
        email: existingUser.email,
        verified: existingUser.verified,
      });
    } else {
      return res.json({ message: "Invalid credential" });
    }
  } else {
    return res.json({ message: "Credentials are not valid" });
  }
};

export const customerVerify = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { otp } = req.body;
  const customer = req.user;
  if (customer) {
    let profile = await Customer.findById(customer._id);
    if (profile) {
      if (profile.otp == parseInt(otp) && profile.otp_expiry <= new Date()) {
        profile.verified = true;
        const updatedCustomer = await profile.save();
        const signature = GenerateSignature({
          _id: updatedCustomer.id,
          email: updatedCustomer.email,
          verified: updatedCustomer.verified,
        });

        return res.status(201).json({
          signature: signature,
          email: updatedCustomer.email,
          verified: updatedCustomer.verified,
        });
      } else {
        return res.status(400).json({ message: " Otp validation error" });
      }
    }
  }
};

export const requestOtpNumber = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;
  if (customer) {
    let profile = await Customer.findById(customer._id);
    if (profile) {
      const { otp, expiry } = GenerateOtp();
      profile.otp = otp;
      profile.otp_expiry = expiry;
      profile.verified = true;
      await profile.save();
      await requestOtp(otp, profile.phone);

      return res.status(201).json({
        message: "Otp is sent to your registered mobile number",
      });
    } else {
      return res.status(400).json({ message: "Error with request otp" });
    }
  } else {
    return res.status(400).json({ message: "user not present" });
  }
};

export const editCustomerProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customerInputs = plainToClass(EditCustomerInputs, req.body);
  const inputErrors = await validate(customerInputs, {
    validationError: { target: true },
  });

  if (inputErrors?.length > 0) {
    return res.status(400).json({ error: inputErrors });
  }
  const user = req.user;
  const { firstName, lastName, address } = customerInputs;

  if (user !== null) {
    const existingUser = await Customer.findById(user?._id);
    if (existingUser !== null) {
      console.log(existingUser);
      existingUser.firstName = firstName;
      existingUser.lastName = lastName;
      existingUser.address = address;
      await existingUser.save();
      return res.status(201).json({
        message: "updated successfully",
        result: existingUser,
      });
    } else {
      return res.status(400).json({ message: "Invalid credential" });
    }
  } else {
    return res.status(400).json({ message: "something went wrong" });
  }
};
export const getCustomerProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user !== null) {
    const existingUser = await Customer.findById(user?._id);
    if (existingUser !== null) {
      return res.status(201).json(existingUser);
    } else {
      return res.status(400).json({ message: "Invalid credential" });
    }
  } else {
    return res.status(400).json({ message: "something went wrong" });
  }
};

/* ----------------------- order section --------------------------*/

export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;
  if (customer) {
    const orderId = `${Math.floor(Math.random() * 89999) + 1000}`;
    const profile = await Customer.findById(customer._id);
    const cart = <[OrderInputs]>req.body;
    let cartItems = Array();
    let netAmount = 0.0;
    const foods = await Food.find()
      .where("_id")
      .in(cart.map((item) => item._id))
      .exec();

    foods?.map((food) => {
      cart.map(({ _id, unit }) => {
        if (food._id == _id) {
          netAmount += food.price * unit;
          cartItems.push({ food, unit });
        }
      });
    });

    if (cartItems) {
      const currentOrder = await Order.create({
        orderId: orderId,
        items: cartItems,
        totalAmmount: netAmount,
        orderDate: new Date(),
        paidThrough: "cod",
        paymentResponse: "",
        orderStatus: "waiting..",
      });

      if (currentOrder) {
        profile?.orders.push(currentOrder);
        await profile?.save();
        return res.status(201).json(currentOrder);
      }
    }
    return res.status(404).json({ message: "order not created" });
  }
};
