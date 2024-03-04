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
    discount?: {
      amount: number;
    };
  };
  yearly: {
    premium: PricingDetail;
    enterprise: PricingDetail;
    discount?: {
      amount: number;
    };
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
      discount: {
        amount: { type: Number, required: false },
      },
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
      discount: {
        amount: { type: Number, required: false },
      },
    },
    active: { type: Boolean, required: true, default: false },
  },
  { timestamps: true, versionKey: false }
);

paymentSchema.pre<Pricing>("save", async function (next) {
  if (this.isNew && this.active) {
    //* If a new Payment is being created and it's active then
    //* Deactivate all other existing payments
    await this.model("Payment").updateMany(
      { _id: { $ne: this._id } },
      { $set: { active: false } }
    );
  }
  next();
});

const PaymentModel = model<Pricing>("Payment", paymentSchema);

export default PaymentModel;
