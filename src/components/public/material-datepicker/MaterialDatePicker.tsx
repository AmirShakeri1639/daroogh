import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import React, { useState } from 'react';
import { createStyles, makeStyles, Switch, TextField } from '@material-ui/core';
import moment from 'moment';
// @ts-ignore
import jMoment from 'moment-jalaali';
import JalaliUtils from '@date-io/jalaali';
import { useTranslation } from 'react-i18next';
import DateFnsUtils from '@date-io/date-fns';
import Input from '../input/Input';

jMoment.loadPersian({ dialect: 'persian-modern', usePersianDigits: true });

interface MaterialDatePicker {
  locale?: 'en' | 'fa';
  dateTypeIsSelectable?: boolean;
  variant: 'variant' | 'inline' | 'static' | 'dialog';
}

const useStyle = makeStyles((theme) =>
  createStyles({
    buttonContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
  })
);

const MaterialDatePicker: React.FC<MaterialDatePicker> = ({
  locale,
  dateTypeIsSelectable,
  variant,
}) => {
  const [selectedDate, setSelectedDate] = useState<any>(moment());
  const [selectedDateType, setSelectedDateType] = useState<'fa' | 'en'>('fa');

  const { buttonContainer } = useStyle();

  const { t } = useTranslation();

  const faDatePickerHandler = (): JSX.Element => {
    return (
      <DatePicker
        inputVariant="outlined"
        clearable
        okLabel="تأیید"
        cancelLabel="لغو"
        clearLabel="پاک کردن"
        labelFunc={(date): string => (date ? date.format('jYYYY/jMM/jDD') : '')}
        value={selectedDate}
        onChange={setSelectedDate}
        variant={variant}
        // TextFieldComponent={<TextField />}
      />
    );
  };

  const enDatePickerHandler = (): JSX.Element => {
    return (
      <DatePicker
        inputVariant="outlined"
        value={selectedDate}
        labelFunc={(date): string => (date ? date.format('YYYY/MM/DD') : '')}
        onChange={setSelectedDate}
      />
    );
  };

  const dateTypeButtons = (): any => {
    return (
      <div className={buttonContainer}>
        <span>{t('date.gregorian')}</span>
        <Switch
          checked={selectedDateType === 'fa'}
          onChange={(): void => {
            setSelectedDateType(selectedDateType === 'fa' ? 'en' : 'fa');
            setSelectedDate(moment());
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
      <MuiPickersUtilsProvider
        utils={selectedDateType === 'fa' ? JalaliUtils : DateFnsUtils}
        // locale={selectedDateType}
      >
        {dateTypeIsSelectable && dateTypeButtons()}
        {selectedDateType === 'fa'
          ? faDatePickerHandler()
          : enDatePickerHandler()}
      </MuiPickersUtilsProvider>
    </div>
  );
};

MaterialDatePicker.defaultProps = {
  locale: 'fa',
  dateTypeIsSelectable: false,
};

export default MaterialDatePicker;
