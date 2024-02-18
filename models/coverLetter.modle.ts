import mongoose, { Schema } from "mongoose";

const CoverLetterSchema = new Schema(
  {
    _id: Schema.Types.Mixed,
    historyId: Schema.Types.Mixed,
    templateId: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    fullName: String,
    JobTitle: String,
    address: String,
    email: String,
    phoneNumber: String,
    companyName: String,
    managerName: String,
    details: String,
    zoom: Number,
    size: {},
    style: {},
  },
  { timestamps: false, versionKey: false }
);

const CoverLetterModel = mongoose.model("CoverLetter", CoverLetterSchema);

export default CoverLetterModel;
