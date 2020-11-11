import jwt from 'jsonwebtoken';

class Validation {
  isValidUserToken(token: string): boolean {
    const decodedJWT: any = jwt.decode(token);
    if (Math.floor(Date.now() / 1000) <= decodedJWT.exp) {
      return true;
    }
    // TODO: I must handle it later with unexpired token
    // localStorage.removeItem('user');
    return false;
  }

  isValidaMobileNumber(mobileNumber: string): boolean {
    const regex = /^09\d{9}$/g;
    return regex.test(mobileNumber);
  }
}

export default Validation;

