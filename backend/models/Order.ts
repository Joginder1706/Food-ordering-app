import mongoose, { Schema, Model, Document } from "mongoose";

export interface OrderDoc extends Document {
  orderId: string;
  vandorId: string;
  items: [any];
  totalAmmount: number;
  orderDate: Date;
  paidThrough: string;
  paymentResponse: string;
  orderStatus: string;
  remarks: string;
  deliveryId: string;
  appliedOffers: boolean;
  offerId: string;
  readyTime: number;
}

const OrderSchema = new Schema(
  {
    orderId: {
      type: String,
      required: true,
    },
    vandorId: {
      type: String,
      require: true,
    },
    items: [
      {
        food: { type: Schema.Types.ObjectId, ref: "food", required: true },
        unit: { type: Number, required: true },
      },
    ],
    totalAmmount: {
      type: Number,
      required: true,
    },
    orderDate: {
      type: Date,
    },
    paidThrough: {
      type: String,
    },
    paymentResponse: {
      type: String,
    },
    orderStatus: {
      type: String,
    },
    remarks: { type: String },
    deliveryId: { type: String },
    appliedOffers: { type: Boolean },
    offerId: { type: String },
    readyTime: { type: Number },
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

const Order = mongoose.model<OrderDoc>("order", OrderSchema);
export { Order };
