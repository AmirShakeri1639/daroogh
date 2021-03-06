import { WorkTimeEnum } from '../enum';

export interface PharmacyWithUserInterface {
  pharmacy: {
    id: number;
    name: string;
    hix: string;
    gli: string;
    workTime: WorkTimeEnum;
    address: string;
    mobile: string;
    telphon: string;
    webSite: string;
    email: string;
    postalCode: string;
    description: string;
    countryDivisionID: number | string;
    x?: string;
    y?: string;
  };
  user: {
    id?: number;
    pharmacyID?: number | null;
    name: string;
    family: string;
    mobile: string;
    email?: string | null;
    userName: string;
    password?: string;
    nationalCode: string;
    birthDate?: string | null;
    birthDateYear?: string | null;
    birthDateMonth?: string | null;
    birthDateDay?: string | null;
    isValidBirthDate?: boolean;
    gender?: number | null;
  };
}
