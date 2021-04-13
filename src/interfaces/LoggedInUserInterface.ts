export interface LoggedInUserInterface {
  userId: number | string;
  name: string;
  family: string;
  token: string;
  currentPharmacyKey: string;
  imageKey: string;
  pharmacyName: string;
  gender?: number | string;
}

export const TokenRoles: string = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
export const TokenUserData: string = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/userdata';
export const TokenUserId: string = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier';
