export interface PharmacyInfo {
  message: string;
  data: {
    id: number;
    name: string;
    hix: string;
    gli: string;
    type: number;
    workTime: number;
    address: string;
    countryDivisionID: number;
    x?: number;
    y?: number;
    mobile: string;
    telphon: string;
    fax: string;
    webSite: string;
    email?: string;
    logoFileID?: number;
    postalCode: string;
    description: string;
    active: boolean;
    warranty?: any;
    userType: number;
    star: number;
    typeString: string;
    workTimeString: string;
    logoFileKey: string;
    activeString: string;
    pharmacyProvince:string;
  };
}
