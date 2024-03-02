import mongoose, { Document, Schema } from "mongoose";

export interface IPamentHistory extends Document {
  user: Schema.Types.ObjectId;
  type: "premium" | "enterprise";
  downloadlimite: number;
  timeLimite: number;
  amount: number;
  transactionId: string;
  price: string;
}

const pamentHistorySchema = new Schema<IPamentHistory>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      required: true,
      enum: ["premium", "enterprise"],
    },
    downloadlimite: {
      type: Number,
      required: true,
    },
    timeLimite: {
      type: Number,
      required: true,
    },
    transactionId: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

const PamentHistoryModel = mongoose.model<IPamentHistory>(
  "PamentsHistory",
  pamentHistorySchema
);

export default PamentHistoryModel;
