"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const ResumePersonalInfoSchema = new mongoose_1.Schema({
    _id: mongoose_1.Schema.Types.Mixed,
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
const SingleEmploymentHistorySchema = new mongoose_1.Schema({
    _id: mongoose_1.Schema.Types.Mixed,
    city: String,
    description: String,
    employer: String,
    endMontYear: String,
    jobTitle: String,
    startMontYear: String,
});
const SkillSchema = new mongoose_1.Schema({
    _id: mongoose_1.Schema.Types.Mixed,
    label: String,
    level: Number,
});
const LanguageSchema = new mongoose_1.Schema({
    _id: mongoose_1.Schema.Types.Mixed,
    language: String,
    level: String,
});
const ReferenceSchema = new mongoose_1.Schema({
    _id: mongoose_1.Schema.Types.Mixed,
    name: String,
    company: String,
    phone: String,
    email: String,
});
const EducationHistorySchema = new mongoose_1.Schema({
    _id: mongoose_1.Schema.Types.Mixed,
    school: String,
    degree: String,
    startMontYear: String,
    endMontYear: String,
    city: String,
    description: String,
});
const SocialWebSiteSchema = new mongoose_1.Schema({
    _id: mongoose_1.Schema.Types.Mixed,
    label: String,
    link: String,
});
const SectionTitleSchema = new mongoose_1.Schema({
    _id: mongoose_1.Schema.Types.Mixed,
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
const ResumeSchema = new mongoose_1.Schema({
    _id: mongoose_1.Schema.Types.Mixed,
    historyId: mongoose_1.Schema.Types.Mixed,
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
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
}, { timestamps: false, versionKey: false });
// Compile the schema into a model
const ResumeModel = mongoose_1.default.model("Resume", ResumeSchema);
exports.default = ResumeModel;
