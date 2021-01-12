import { LoggedInUserInterface } from '../interfaces';
import JwtData from './JwtData';

class Impersonation {
  userData: LoggedInUserInterface;
  mainToken: string = '';
  currentToken: string = '';

  constructor() {
    const jwtData = new JwtData();
    this.userData = jwtData.userData;
    const mtoken = localStorage.getItem('mainToken');
    this.mainToken = mtoken === null ? jwtData.userData.token : mtoken;
    this.currentToken = jwtData.userData.token;
  }

  changeToken(newToken: string): void {
    this.currentToken = newToken;
    this.userData.token = newToken;
    localStorage.setItem('mainToken', this.mainToken);
    localStorage.setItem('user', JSON.stringify(this.userData));
  }

  changeTokenToMain(): void {
    this.changeToken(this.mainToken);
  }
}

export default Impersonation;
