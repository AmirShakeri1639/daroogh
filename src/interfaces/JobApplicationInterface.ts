import { MaritalStatusType, GenderType } from '../enum';
import { StateType, WorkShiftType, EducationLevel, JobPositionType, SkillLevel } from 'enum/Job';

export interface JobApplicationInterface {
  id: number;
  
  genderStr?: string;
 name?: string;
 family: string;
 mobile?:string;
 workExperienceYear?: number;
 

}

