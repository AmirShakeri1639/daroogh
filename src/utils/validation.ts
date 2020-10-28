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
}

export default Validation;

