import Utils from 'components/public/utility/Utils';
import jwt from 'jsonwebtoken';

class Validation {
  isValidUserToken(token: string): boolean {
    const decodedJWT: any = jwt.decode(token);
    if (Math.floor(Date.now() / 1000) <= decodedJWT.exp) {
      (window as any).CRISP_WEBSITE_ID = 'd13151c7-f239-458c-809c-276a5895fa58';
      return true;
    }
    // TODO: I must handle it later with unexpired token
    // localStorage.removeItem('user');
    (window as any).$crisp = [];
    return false;
  }

  isValidaMobileNumber(mobileNumber: string): boolean {
    mobileNumber = Utils.fixNumbers(mobileNumber);
    const regex = /^09\d{9}|9\d{9}$/g;

    return regex.test(mobileNumber);
  }

  isValidOtpCode(code: string): boolean {
    code = Utils.fixNumbers(code);
    const regex = /^\d{4}$/g;
    return regex.test(code);
  }


}

export default Validation;

