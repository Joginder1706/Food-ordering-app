import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { VandorPayload } from "../dto";
import { APP_SECRET } from "../config";
import { Request } from "express";
import { AuthPayload } from "../dto/Auth.dto";

export const GenerateSalt = async () => {
  return await bcrypt.genSalt();
};
export const GeneratePassword = async (password: string, salt: string) => {
  return await bcrypt.hash(password, salt);
};

export const matchedPassword = async (
  hashed: string,
  password: string,
  salt: string
) => {
  return (await GeneratePassword(password, salt)) === hashed;
};

export const GenerateSignature = (payload: AuthPayload) => {
  return jwt.sign(payload, APP_SECRET, { expiresIn: "1d" });
};

export const ValidateSignature = async (req: Request) => {
  const sign = req.get("Authorization");
  if (sign) {
    const payload = (await jwt.verify(
      sign.split(" ")[1],
      APP_SECRET
    )) as AuthPayload;

    req.user = payload;
    return true;
  }
  return false;
};
