import CryptoJS from 'crypto-js';

export class EncrDecrService {
  encryptionKey = 'ABCDEF1900@!123qweasd.';

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
