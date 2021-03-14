// @ts-ignore
import jalaali from 'jalaali-js';
import moment from 'jalali-moment';

export const today = (separator: string = '/'): string => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  const year = today.getFullYear();

  return `${year}${separator}${month}${separator}${day}`;
}

export const todayJalali = (): string => {
  return (
    moment(today(), 'YYYY/MM/DD')
      .locale('fa')
      .format('YYYY/MM/DD')
  );
}

export const getJalaliDate = (gregorianDate: string): string => {
  return (
    moment(gregorianDate, 'YYYY/MM/DD')
      .locale('fa')
      .format('YYYY/MM/DD')
  );
}

export default jalaali;
