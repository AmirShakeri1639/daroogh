import moment from 'moment';

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
}
