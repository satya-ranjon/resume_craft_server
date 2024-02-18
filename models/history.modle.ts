import mongoose, { Document, Schema } from "mongoose";

export interface IHistory extends Document {
  _id: string | number;
  title: string;
  user: Schema.Types.ObjectId;
  templateId: string | number;
  thumbnail: {
    public_id: string;
    url: string;
  };
  type: "resume" | "coverletter" | "portfolio";
}

const historySchema = new Schema<IHistory>(
  {
    _id: { type: Schema.Types.Mixed, required: true },
    title: String,
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    templateId: { type: Schema.Types.Mixed, required: true },
    thumbnail: {
      public_id: String,
      url: String,
    },
    type: { type: String, enum: ["resume", "coverletter", "portfolio"] },
  },
  { timestamps: true, versionKey: false }
);

const HistoryModel = mongoose.model<IHistory>("History", historySchema);

export default HistoryModel;
