import mongoose, { Schema, Model, Document } from "mongoose";
import { OrderDoc } from "./Order";

interface CustomerDoc extends Document {
  email: string;
  password: string;
  address: string;
  phone: string;
  salt: string;
  firstName: string;
  lastName: string;
  verified: boolean;
  otp: number;
  otp_expiry: Date;
  lat: number;
  lng: number;
  cart: [any];
  orders: [OrderDoc];
}

const CustomerSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    salt: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: Number,
      required: true,
    },
    otp_expiry: {
      type: Date,
      required: true,
    },
    lat: {
      type: Number,
      required: true,
    },
    lng: {
      type: Number,
      required: true,
    },
    cart: [
      {
        food: { type: Schema.Types.ObjectId,ref:'food', require: true },
        unit: { type: Number, require: true },
      },
    ],
    orders: [
      {
        type: Schema.Types.ObjectId,
        ref: "order",
      },
    ],
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.__v;
        delete ret.salt;
        delete ret.createdAt;
        delete ret.updatedAt;
      },
    },
    timestamps: true,
  }
);

const Customer = mongoose.model<CustomerDoc>("customer", CustomerSchema);
export { Customer };
