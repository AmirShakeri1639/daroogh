// @ts-nocheck
import React, { useState } from 'react';
import { Calendar } from 'react-modern-calendar-datepicker';
import "react-modern-calendar-datepicker/lib/DatePicker.css";

interface DateTimePickerProps {
  selectedDateHandler: (date: string) => void;
}

const DateTimePicker: React.FC<DateTimePickerProps> = (props) => {
  const [selectedDate,] = useState<string>('');

  const { selectedDateHandler } = props;

  const datePickerHandler = (_selectedDate): void => {
    const { day: d, month: m, year: y } = _selectedDate;
    selectedDateHandler(`${y}/${m < 10 ? `0${m}` : m}/${d < 10 ? `0${d}` : d}`);
  };

  return (
    <Calendar
      value={selectedDate}
      shouldHighlightWeekends
      onChange={(selectedDate): void => datePickerHandler(selectedDate)}
      locale="fa"
    />
  );
};

export default DateTimePicker;
