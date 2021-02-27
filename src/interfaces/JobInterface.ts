import { MaritalStatusType, GenderType } from '../enum';
import { StateType, WorkShiftType, EducationLevel, JobPositionType, SkillLevel } from 'enum/Job';

export interface JobInterface {
  id: number;
  pharmacyID: number;
  maritalStatus: MaritalStatusType;
  gender: GenderType;
  hasReadingPrescriptionCertificate: StateType;
  minGradeOfReadingPrescriptionCertificate?: number;
  minWorkExperienceYear?: number;
  suggestedWorkShift: WorkShiftType;
  pharmaceuticalSoftwareSkill: SkillLevel;
  computerSkill: SkillLevel;
  foreignLanguagesSkill: SkillLevel;
  hasGuarantee: boolean;
  jobPosition: JobPositionType;
  education: EducationLevel;
  maxAge: number;
  livingInArea: number;
  descriptions?: string;
  sendDate: string;
  cancelDate?: string;
  _date: string;
  _userid: 0;
  hasReadingPrescriptionCertificateStr?: string;
  livingInAreaStr?: string;
  hasGuaranteeStr?: string;
  genderStr?: string;
  suggestedWorkShiftStr?: string;
  maritalStatusStr?: string;
  pharmaceuticalSoftwareSkillStr?: string;
  computerSkillStr?: string;
  foreignLanguagesSkillStr?: string;
  jobPositionStr?: string;
  educationStr?: string;
}
