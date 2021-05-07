// @ts-ignore
import jalaali from 'jalaali-js';
import moment from 'jalali-moment';
import { errorHandler } from 'utils'

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

export const getJalaliDate = (
  gregorianDate: any, separator: string = '/'
): string => {
  if (typeof gregorianDate === 'string') {
    return (
      moment(gregorianDate, 'YYYY/MM/DD')
        .locale('fa')
        .format(`YYYY${separator}MM${separator}DD`)
    )
  }
  try {
    const jalali = jalaali.toJalaali(gregorianDate)
    return (
      jalali.jy + separator +
      jalali.jm + separator + 
      jalali.jd
    )
  } catch (e) {
    errorHandler(e)
    return ''
  }
}

export const getJalaliLastWeek = (): string => {
  const today = new Date()
  const past = today.getDate() - 7
  today.setDate(past)
  console.log(getJalaliDate(today))
  return getJalaliDate(today)
}

export const toGregorian = (
  shamsiDate: string, separator: string = '-'
): string => {
  if (!shamsiDate) return ''
  const shamsiDateArray = shamsiDate.split('/')
  const gregorianDate = jalaali.toGregorian(
    Number(shamsiDateArray[0]),
    Number(shamsiDateArray[1]),
    Number(shamsiDateArray[2])
  )
  return (
    gregorianDate.gy + separator +
    gregorianDate.gm + separator +
    gregorianDate.gd
  )
}

export default jalaali;
