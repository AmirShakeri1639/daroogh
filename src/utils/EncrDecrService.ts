import CryptoJS from 'crypto-js';
import JwtData from './JwtData';

export class EncrDecrService {
  // encryptionKey = 'ABCDEF1900@!123qweasd.';
  encryptionKey = 'ABCDEF1.';

  constructor() {
    const jwtData = new JwtData();
    this.encryptionKey =
      this.encryptionKey + 
      jwtData.userData.token.substr(jwtData.userData.token.length - 15, 15)
    this.encryptionKey = this.encryptionKey.substr(0, 22)
    console.log('enc key + salt:', this.encryptionKey)
  }

  encrypt = (value: any, keys: any = ''): string => {

    if (keys === '') keys = this.encryptionKey;
    const key = CryptoJS.enc.Base64.parse(keys);
    const iv = CryptoJS.enc.Base64.parse(keys);
    const encrypted = CryptoJS.AES.encrypt(
      CryptoJS.enc.Utf8.parse(value.toString()), key,
    {
        keySize: 128 / 32,
        iv: iv,
        // mode: CryptoJS.mode.CBC,
        // padding: CryptoJS.pad.Pkcs7
    });

    return encrypted.toString();
  }
  
  decrypt = (value: any, keys: any = ''): string => {
    if (keys === '') keys = this.encryptionKey;
    const key = CryptoJS.enc.Base64.parse(keys);
    const iv = CryptoJS.enc.Base64.parse(keys);
    const decrypted = CryptoJS.AES.decrypt(
      value, key, {
        keySize: 128 / 32,
        iv: iv,
        // mode: CryptoJS.mode.CBC,
        // padding: CryptoJS.pad.Pkcs7
    });

    return decrypted.toString(CryptoJS.enc.Utf8);
  }
}
