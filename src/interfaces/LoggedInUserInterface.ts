export interface LoggedInUserInterface {
  name: string;
  family: string;
  token: string;
  currentPharmacyKey: string;
}

export interface TokenInterface {
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': string[] | null;
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/userdata': string | null;
}
