import { LoggedInUserInterface } from '../interfaces';
import JwtData from './JwtData';

class Impersonation {
  userData: LoggedInUserInterface;
  mainToken: string = '';
  currentToken: string = '';
  mainPharmacyName: string = '';
  currentPharmacyName: string = '';

  constructor() {
    const jwtData = new JwtData();
    this.userData = jwtData.userData;
    const mtoken = localStorage.getItem('mainToken');
    this.mainToken = mtoken === null ? jwtData.userData.token : mtoken;
    const mPhName = localStorage.getItem('mainPharmacyName');
    this.mainPharmacyName = mPhName === null ? jwtData.userData.pharmacyName : mPhName;
    this.currentToken = jwtData.userData.token;
    this.currentPharmacyName = jwtData.userData.pharmacyName;
  }

  changeToken(newToken: string, newPharmacyName: string = ''): void {
    this.currentToken = newToken;
    this.userData.token = newToken;
    const phName = newPharmacyName === '' 
      ? this.mainPharmacyName : newPharmacyName;
    this.currentPharmacyName = phName;
    this.userData.pharmacyName = phName;
    localStorage.setItem('mainToken', this.mainToken);
    localStorage.setItem('mainPharmacyName', this.mainPharmacyName);
    localStorage.setItem('user', JSON.stringify(this.userData));
  }

  changeTokenToMain(): void {
    this.changeToken(this.mainToken, this.mainPharmacyName);
  }
}

export default Impersonation;
