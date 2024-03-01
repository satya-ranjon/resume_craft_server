import mongoose, { Document, Schema } from "mongoose";

export interface IPamentHistory extends Document {
  user: Schema.Types.ObjectId;
  type: "premium" | "enterprise";
  downloadlimite: number;
  timeLimite: number;
  amount: number;
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
    },
    timeLimite: {
      type: Number,
    },
  },
  { timestamps: true, versionKey: false }
);

const PamentHistoryModel = mongoose.model<IPamentHistory>(
  "PamentsHistory",
  pamentHistorySchema
);

export default PamentHistoryModel;
