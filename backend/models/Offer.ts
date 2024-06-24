import mongoose, { Schema, Model, Document } from "mongoose";

export interface OfferDoc extends Document {
  offerType: string; // vandor || genric
  vandors: [any];
  title: string;
  description: string;
  minValue: number;
  offerAmount: number;
  startValidity: Date;
  endValidity: Date;
  promocode: string;
  promoType: string;
  bank: [any];
  bins: [any];
  pincode: string;
  isActive: boolean;
}

const offerSchema = new Schema(
  {
    offerType: {
      type: String,
      required: true,
    },
    vandors: [
      {
        type: Schema.Types.ObjectId,
        ref: "vandor", // Use Schema.Types.ObjectId if referencing another model
      },
    ],
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    minValue: {
      type: Number,
      required: true,
    },
    offerAmount: {
      type: Number,
      required: true,
    },
    startValidity: Date,
    endValidity: Date,
    promocode: {
      type: String,
      required: true,
    },
    promoType: {
      type: String,
      required: true,
    },
    bank: [
      {
        type: String, // Use Schema.Types.ObjectId if referencing another model
      },
    ],
    bins: [
      {
        type: Number, // Use Schema.Types.ObjectId if referencing another model
      },
    ],
    pincode: {
      type: String,
      required: true,
    },
    isActive: Boolean,
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
      },
    },
    timestamps: true,
  }
);

const Offer = mongoose.model<OfferDoc>("offer", offerSchema);
export { Offer };
