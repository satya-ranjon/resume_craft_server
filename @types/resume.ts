import { Document, Schema } from "mongoose";

export interface IResume extends Document {
  _id: string | number;
  historyId: string | number;
  user: Schema.Types.ObjectId;
  templateId: string;
  avatar: {
    public_id: string;
    url: string;
  };
  personalInfo: IResumePersonalInfo;
  professionalSummary: string;
  workExperience: TypeOfSingleEmploymentHistory[];
  skills: TypeOfSkill[];
  languages: TypeOfLanguage[];
  references: TypeOfReference[];
  educations: TypeOfSingleEducationHistory[];
  socialProfiles: TypeOfSingleSocialWebSite[];
  sectionTitles: TypeOfSectionTitle;
  zoom: number;
  size: {};
  style: {};
}
export interface IResumePersonalInfo extends Document {
  _id: string | number;
  jobTitle: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  country: string;
  city: string;
  address: string;
  postalCode: string;
  drivingLicense: string;
  nationality: string;
  placeOfBirth: string;
  DateOfBirth: string;
}

export interface TypeOfSingleEmploymentHistory extends Document {
  _id: string | number;
  city: string;
  description: string;
  employer: string;
  endMontYear: string;
  jobTitle: string;
  startMontYear: string;
}

export interface TypeOfSkill extends Document {
  _id: string | number;
  label: string;
  level: number;
}

export interface TypeOfLanguage extends Document {
  _id: string | number;
  language: string;
  level: string;
}

export interface TypeOfReference extends Document {
  _id: string | number;
  name: string;
  company: string;
  phone: string;
  email: string;
}

export interface TypeOfSingleEducationHistory extends Document {
  _id: string | number;
  school: string;
  degree: string;
  startMontYear: string;
  endMontYear: string;
  city: string;
  description: string;
}

export interface TypeOfSingleSocialWebSite extends Document {
  _id: string | number;
  label: string;
  link: string;
}

export interface TypeOfSectionTitle extends Document {
  _id: string | number;
  personalInfo: string;
  professionalSummary: string;
  workExperience: string;
  skills: string;
  languages: string;
  references: string;
  educations: string;
  socialProfiles: string;
}
