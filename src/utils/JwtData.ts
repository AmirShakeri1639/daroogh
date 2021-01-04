import { LoggedInUserInterface, TokenInterface } from "../interfaces";
import { errorHandler } from "./index";

class JwtData {
  userData: LoggedInUserInterface = {
    name: '',
    family: '',
    token: '',
    currentPharmacyKey: '',
    imageKey: '',
    pharmacyName: '',
  };

  parsedToken: TokenInterface = {
    'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': [],
    'http://schemas.microsoft.com/ws/2008/06/identity/claims/userdata': '',
  };

  parseJwt = (token: string): any => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  }

  constructor() {
    try {
      const userFromStorage = localStorage.getItem('user');
      if (!userFromStorage) {
        errorHandler('user token is null');
        return;
      }
      const userFromStorageJSON = JSON.parse(userFromStorage);
      this.userData = {
        name: userFromStorageJSON.name,
        family: userFromStorageJSON.family,
        token: userFromStorageJSON.token,
        imageKey: userFromStorageJSON.imageKey,
        pharmacyName: userFromStorageJSON.pharmacyName,
        currentPharmacyKey: userFromStorageJSON.currentPharmacyKey
      };

      this.parsedToken = this.parseJwt(this.userData.token);
    } catch (e) {
      errorHandler(e);
    }
  }

  roles = (): any => {
    const rolesArray =
      this.parsedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

    return rolesArray;
  }
}

export default JwtData;
