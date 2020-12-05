import {WorkTimeEnum} from '../enum';

export interface PharmacyInterface {
  id: number;
  name: string;
  hix: string;
  gli: string;
  workTime: WorkTimeEnum;
  address: string;
  mobile: string;
  telphon: string;
  website: string;
  email: string;
  postalCode: string;
  description: string;
  active: boolean;
  countryDivisionID: number;
}
