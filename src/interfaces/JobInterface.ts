import { MaritalStatusType, GenderType } from '../enum';
import { StateType, WorkShiftType, EducationLevel, JobPositionType, SkillLevel } from 'enum/Job';

export interface JobInterface {
  id: number;
  maritalStatus?: MaritalStatusType;
  gender?: GenderType;
  hasReadingPrescriptionCertificate?: StateType;
  minGradeOfReadingPrescriptionCertificate?: number;
  minWorkExperienceYear?: number;
  suggestedWorkShift?: WorkShiftType;
  pharmaceuticalSoftwareSkill?: SkillLevel;
  computerSkill?: SkillLevel;
  foreignLanguagesSkill?: SkillLevel;
  hasGuarantee?: boolean;
  jobPosition?: JobPositionType;
  education?: EducationLevel;
  maxAge: number;
  livingInArea?: number;

  
  descriptions?: string;
  cancelDate?: string;
  maritalStatusStr? :string;
  genderStr?:string;
  hasReadingPrescriptionCertificateStr?:string;
  minGradeOfReadingPrescriptionCertificateStr?:string;
  minWorkExperienceYearStr?:string;
  suggestedWorkShiftStr?:string;
  pharmaceuticalSoftwareSkillStr?:string;
  computerSkillStr?:string;
  foreignLanguagesSkillStr?:string;
  hasGuaranteeStr?:string;
  jobPositionStr?:string;
  educationStr?:string;
  livingInAreaStr?:string;
 

}

