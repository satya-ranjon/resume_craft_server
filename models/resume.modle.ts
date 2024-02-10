import mongoose, { Schema } from "mongoose";
import {
  IResume,
  IResumePersonalInfo,
  TypeOfLanguage,
  TypeOfReference,
  TypeOfSectionTitle,
  TypeOfSingleEducationHistory,
  TypeOfSingleEmploymentHistory,
  TypeOfSingleSocialWebSite,
  TypeOfSkill,
} from "../@types/resume";

const ResumePersonalInfoSchema = new Schema<IResumePersonalInfo>({
  _id: Schema.Types.Mixed,
  jobTitle: String,
  firstName: String,
  lastName: String,
  email: String,
  phoneNumber: String,
  country: String,
  city: String,
  address: String,
  postalCode: String,
  drivingLicense: String,
  nationality: String,
  placeOfBirth: String,
  DateOfBirth: String,
});

const SingleEmploymentHistorySchema = new Schema<TypeOfSingleEmploymentHistory>(
  {
    _id: Schema.Types.Mixed,
    city: String,
    description: String,
    employer: String,
    endMontYear: String,
    jobTitle: String,
    startMontYear: String,
  }
);

const SkillSchema = new Schema<TypeOfSkill>({
  _id: Schema.Types.Mixed,
  label: String,
  level: Number,
});

const LanguageSchema = new Schema<TypeOfLanguage>({
  _id: Schema.Types.Mixed,
  language: String,
  level: String,
});

const ReferenceSchema = new Schema<TypeOfReference>({
  _id: Schema.Types.Mixed,
  name: String,
  company: String,
  phone: String,
  email: String,
});

const EducationHistorySchema = new Schema<TypeOfSingleEducationHistory>({
  _id: Schema.Types.Mixed,
  school: String,
  degree: String,
  startMontYear: String,
  endMontYear: String,
  city: String,
  description: String,
});

const SocialWebSiteSchema = new Schema<TypeOfSingleSocialWebSite>({
  _id: Schema.Types.Mixed,
  label: String,
  link: String,
});

const SectionTitleSchema = new Schema<TypeOfSectionTitle>({
  _id: Schema.Types.Mixed,
  personalInfo: String,
  professionalSummary: String,
  workExperience: String,
  skills: String,
  languages: String,
  references: String,
  educations: String,
  socialProfiles: String,
});

// Define main Resume schema
const ResumeSchema = new Schema<IResume>(
  {
    _id: Schema.Types.Mixed,
    historyId: Schema.Types.Mixed,
    user: { type: Schema.Types.ObjectId, ref: "User" },
    templateId: { type: String, required: true },
    avatar: String,
    personalInfo: ResumePersonalInfoSchema,
    professionalSummary: String,
    workExperience: [SingleEmploymentHistorySchema],
    skills: [SkillSchema],
    languages: [LanguageSchema],
    references: [ReferenceSchema],
    educations: [EducationHistorySchema],
    socialProfiles: [SocialWebSiteSchema],
    sectionTitles: SectionTitleSchema,
    zoom: Number,
    size: {},
    style: {},
  },
  { timestamps: false, versionKey: false }
);

// Compile the schema into a model
const ResumeModel = mongoose.model<IResume>("Resume", ResumeSchema);

export default ResumeModel;
