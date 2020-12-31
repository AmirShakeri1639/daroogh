import { JalaliInterface } from '../interfaces/general';
// @ts-ignore
import jalali from 'jalaali-js';

class Convertor {
  convertISOTime(time: string): string {
    // @ts-ignore
    const gregorianDate = time.split('T')[0].split('-');
    const convertedDate: JalaliInterface = jalali.toJalaali(
      Number(gregorianDate[0]),
      Number(gregorianDate[1]),
      Number(gregorianDate[2])
    );
    return `${convertedDate.jy}-${
      convertedDate.jm < 10 ? `0${convertedDate.jm}` : convertedDate.jm
    }-${convertedDate.jd < 10 ? `0${convertedDate.jd}` : convertedDate.jd}`;
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
}

export default new Convertor();
