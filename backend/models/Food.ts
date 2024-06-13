import mongoose, { Schema, Model, Document } from "mongoose";

export interface FoodDoc extends Document {
  vandorId: string;
  name: string;
  description: string;
  category: string;
  price: number;
  foodType: string;
  readyTime: number;
  rating: number;
  images: [string];
}

const foodSchema = new Schema(
  {
    vandorId: {
      type: String,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    foodType: {
      type: String,
      required: true,
    },
    readyTime: {
      type: Number,
      required: true,
    },
    rating: {
      type: Number,
    },
    images: {
      type: [String],
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
        delete ret.createdAt;
        delete ret.updatedAt;
      },
    },
    timestamps: true,
  }
);

const Food = mongoose.model<FoodDoc>("food", foodSchema);
export { Food };
