import jwt from 'jsonwebtoken';

class Validation {
  isValidUserToken(token: string): boolean {
    const decodedJWT: any = jwt.decode(token);
    if (Math.floor(Date.now() / 1000) <= decodedJWT.exp) {
      (window as any).CRISP_WEBSITE_ID = 'ab43d0bb-c5a4-48c4-ac43-af2ff652c4fa';
      return true;
    }
    // TODO: I must handle it later with unexpired token
    // localStorage.removeItem('user');
    (window as any).$crisp = [];
    return false;
  }

  isValidaMobileNumber(mobileNumber: string): boolean {
    const regex = /^09\d{9}$/g;
    return regex.test(mobileNumber);
  }

  isValidOtpCode(code: string): boolean {
    const regex = /^\d{4}$/g;
    return regex.test(code);
  }
}

export default Validation;

