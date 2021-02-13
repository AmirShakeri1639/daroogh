import moment from 'moment';
import {default as mom} from 'jalali-moment';

export default class Utils {
  static numberWithCommas = (x: any): string => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  static getDifferenceInDays = (date1: any, date2: any): number => {
    const diffInMs = Math.abs(date2 - date1);
    return Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
  };

  static getPersianDate = (date: any, withTime = false): string | null => {
    if (date === null || date === undefined) {
      return '';
    }

    const dt = new Date(date);
    if (isNaN(dt.valueOf())) {
      return null;
    } else {
      const format = withTime ? 'jYYYY/jMM/jDD - HH:mm:ss' : 'jYYYY/jMM/jDD';
      return moment(dt).locale('fa').format(format);
    }
  };

  static convertGeoToShamsi(date: any): string | null {
    if (date)
      return mom(date, 'YYYY/MM/DD').locale('fa').format('YYYY/MM/DD');
    else return null;
  }

  static convertShamsiToGeo(date: any, format: string): string | null {
    if (date)
      return mom(date, 'jYYYY/jMM/jDD').locale('en').format(format);
    else return null;
  }

  static getExpireDate = (date: any): string => {
    const faDate = mom(date, 'YYYY/MM/DD').locale('fa').format('YYYY/MM/DD');
    const eDate = mom.from(faDate, 'fa', 'YYYY/MM/DD').format('YYYY/MM/DD');
    const fromDate = new Date(eDate);
    const today = new Date();

    const differenceInDays = Utils.getDifferenceInDays(today, fromDate);

    const res = `${faDate} (${differenceInDays} روز)`;

    return res;
  };

  static newGuid = (): string => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = (Math.random() * 16) | 0,
        v = c == 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };
}
