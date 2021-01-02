// @ts-nocheck
import { createStyles, makeStyles, Switch } from '@material-ui/core';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar } from 'react-modern-calendar-datepicker';
import 'react-modern-calendar-datepicker/lib/DatePicker.css';

const useStyle = makeStyles((theme) =>
  createStyles({
    buttonContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
  })
);

interface DateTimePickerProps {
  selectedDateHandler: (date: string) => void;
  locale?: 'en' | 'fa';
  dateTypeIsSelectable?: boolean;
  minimumDate?: {
    year: number;
    month: number;
    day: number;
  };
}

const DateTimePicker: React.FC<DateTimePickerProps> = (props) => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedDateType, setSelectedDateType] = useState<'fa' | 'en'>('fa');

  const {
    selectedDateHandler,
    locale,
    dateTypeIsSelectable,
    minimumDate,
  } = props;

  const datePickerHandler = (_selectedDate): void => {
    const { day: d, month: m, year: y } = _selectedDate;
    selectedDateHandler(`${y}/${m < 10 ? `0${m}` : m}/${d < 10 ? `0${d}` : d}`);
  };

  const { buttonContainer } = useStyle();

  const { t } = useTranslation();

  const dateTypeButtons = (): any => {
    return (
      <div className={buttonContainer}>
        <span>{t('date.gregorian')}</span>
        <Switch
          disabled={true}
          checked={selectedDateType === 'fa'}
          onChange={(): void => {
            setSelectedDateType(selectedDateType === 'fa' ? 'en' : 'fa');
            const { getFullYear, getMonth, getDate } = new Date();
            // setSelectedDate({
            //   year: date.getFullYear(),
            //   month: date.getMonth() + 1,
            //   day: date.getDate(),
            // });
          }}
          name="language-switch"
          inputProps={{ 'aria-label': 'switch-langauge' }}
        />
        <span>{t('date.shamsi')}</span>
      </div>
    );
  };

  return (
    <div>
      {dateTypeIsSelectable && dateTypeButtons()}
      <Calendar
        minimumDate={minimumDate || undefined}
        value={selectedDate}
        shouldHighlightWeekends
        onChange={(selectedDate): void => datePickerHandler(selectedDate)}
        locale={selectedDateType}
      />
    </div>
  );
};

export default DateTimePicker;
