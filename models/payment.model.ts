import { Schema, model, Document } from "mongoose";

interface PricingDetail {
  price: number;
  download: number;
}

export interface Pricing extends Document {
  free: {
    premium: PricingDetail;
    enterprise: PricingDetail;
  };
  monthly: {
    premium: PricingDetail;
    enterprise: PricingDetail;
    discount?: number;
  };
  yearly: {
    premium: PricingDetail;
    enterprise: PricingDetail;
    discount?: number;
  };
  active: boolean;
}

const paymentSchema = new Schema<Pricing>(
  {
    monthly: {
      free: {
        price: { type: Number, required: true },
        download: { type: Number, required: true },
      },
      premium: {
        price: { type: Number, required: true },
        download: { type: Number, required: true },
      },
      enterprise: {
        price: { type: Number, required: true },
        download: { type: Number, required: true },
      },
      discount: { type: Number, required: false },
    },
    yearly: {
      free: {
        price: { type: Number, required: true },
        download: { type: Number, required: true },
      },
      premium: {
        price: { type: Number, required: true },
        download: { type: Number, required: true },
      },
      enterprise: {
        price: { type: Number, required: true },
        download: { type: Number, required: true },
      },
      discount: { type: Number, required: false },
    },
    active: { type: Boolean, required: true, default: false },
  },
  { timestamps: true, versionKey: false }
);

const PaymentModel = model<Pricing>("Payment", paymentSchema);

export default PaymentModel;
