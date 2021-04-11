import { WorkTimeEnum } from '../enum';

export interface PharmacyInterface {
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
  active: boolean;
  countryDivisionID: number | string;
  x?: string;
  y?: string;
}

export interface PharmacyFileInterface {
  id: number
  fileKey: string
  fileName: string
  fileTypeID: number
  fileTypeName: string
}

export interface FileForPharmacyInterface {
  fileTypeID: number | string
  pharmacyId: number | string
  file: any
}

export interface FileForPharmacyGeneralInterface {
  fileTypeID: number | string
  pharmacyKey: number | string
  file: any
}
