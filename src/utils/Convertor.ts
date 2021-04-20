import { JalaliInterface } from '../interfaces/general';
// @ts-ignore
import jalali from 'jalaali-js';

class Convertor {
  convertISOTime(time: string, withTime = false): string {
    // @ts-ignore
    const [gregorianDate, _time] = time.split('T');
    const splitedGregorianDate = gregorianDate.split('-');
    const convertedDate: JalaliInterface = jalali.toJalaali(
      Number(splitedGregorianDate[0]),
      Number(splitedGregorianDate[1]),
      Number(splitedGregorianDate[2])
    );
    const a = `${convertedDate.jy}-${
      convertedDate.jm < 10 ? `0${convertedDate.jm}` : convertedDate.jm
    }-${convertedDate.jd < 10 ? `0${convertedDate.jd}` : convertedDate.jd}${
      withTime ? ' ' + _time.split('.')[0] : ''
    }`;
    return a; 
  }

  thousandsSeperator(number: string | number): string {
    return new Intl.NumberFormat('en-US').format(Number(number));
  }

  thousandsSeperatorFa(number: string | number): string {
    return new Intl.NumberFormat('fa-IR').format(Number(number));
  }

  zeroSeparator(price: number | string): string {
    const formatter = new Intl.NumberFormat('fa-IR', {
      style: 'currency',
      currency: 'IRR',
    });
    return formatter.format(Number(price));
  }

  numberWithZero(number: number | string): string | number {
    return number < 10 ? `0${number}` : number;
  }

  l(v: string | number): string {
    return v.toLocaleString('fa-IR');
  }
}

export default new Convertor();
