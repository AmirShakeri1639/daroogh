export interface EmpAppInterface {
  onClick(): void;
  id: number;
  sendDate: string;
  cancelDate: string;
  suggestedJobPositionStr: string;
  resumeFileKey: string;
}
export interface EmploymentApplicationInterface {
  id: number;
  name: string;
  family: string;
  mobile: string;
  email: string;
  nationalCode: string;
  birthDate: string;
  // pictureFileKey: string;
  gender: number;
  maritalStatus: number;
  hasReadingPrescriptionCertificate: boolean;
  gradeOfReadingPrescriptionCertificate: number;
  workExperienceYear: number;
  suggestedWorkShift: number;
  pharmaceuticalSoftwareSkill: number;
  computerSkill: number;
  foreignLanguagesSkill: number;
  countryDivisionCode: string;
  hasGuarantee: boolean;
  suggestedJobPosition: number;
  education: number;
  address: string;
  landlinePhone: string;
  previousWorkplace: string;
  previousWorkplacePhone: string;
  descriptions: string;
  resumeFileKey: string;
  readingPrescriptionCertificateStr: string;
  hasGuaranteeStr: string;
  genderStr: string;
  suggestedWorkShiftStr: string;
  maritalStatusStr: string;
  pharmaceuticalSoftwareSkillStr: string;
  computerSkillStr: string;
  foreignLanguagesSkillStr: string;
  suggestedJobPositionStr: string;
  educationStr: string;
  sendDate: string;
  cancelDate: string;
}


export interface EmploymentApplicationDataInterface {
  name: string;
  family: string;
  birthDate: string;
  email: string;
  gender: number;
  maritalStatus: number;
  hasReadingPrescriptionCertificate: boolean;
  gradeOfReadingPrescriptionCertificate: number;
  workExperienceYear: number;
  suggestedWorkShift: number;
  pharmaceuticalSoftwareSkill: number;
  computerSkill: number;
  foreignLanguagesSkill: number;
  suggestedJobPosition: number;
  education: number;
  hasGuarantee: boolean;
  countryDivisionCode: string;
  previousWorkplace: string;
  previousWorkplacePhone: string;
  landlinePhone: string;
  file: string;
  address: string;
  descriptions: string;
}

export interface EmpApplicationDataInterface {
  data: EmpAppInterface;
  formHandler: (item: number) => Promise<any>;
}
