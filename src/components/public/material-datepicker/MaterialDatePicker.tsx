import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import React, { useState } from 'react';
import { createStyles, makeStyles, Switch } from '@material-ui/core';
import moment from 'moment';
// @ts-ignore
import jMoment from 'moment-jalaali';
import JalaliUtils from '@date-io/jalaali';
import { useTranslation } from 'react-i18next';
import DateFnsUtils from '@date-io/date-fns';

jMoment.loadPersian({ dialect: 'persian-modern', usePersianDigits: true });

interface MaterialDatePicker {
  locale?: 'en' | 'fa';
  dateTypeIsSelectable?: boolean;
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
}) => {
  const [selectedDate, setSelectedDate] = useState<any>(moment());
  const [selectedDateType, setSelectedDateType] = useState<'fa' | 'en'>('fa');

  const { buttonContainer } = useStyle();

  const { t } = useTranslation();

  const faDatePickerHandler = () => {
    return (
      <DatePicker
        inputVariant="outlined"
        clearable
        okLabel="تأیید"
        cancelLabel="لغو"
        clearLabel="پاک کردن"
        labelFunc={(date) => (date ? date.format('jYYYY/jMM/jDD') : '')}
        value={selectedDate}
        onChange={setSelectedDate}
      />
    );
  };

  const enDatePickerHandler = () => {
    return (
      <DatePicker
        inputVariant="outlined"
        value={selectedDate}
        onChange={setSelectedDate}
      />
    );
  };

  const dateTypeButtons = (): any => {
    return (
      <div className={buttonContainer}>
        <span>{t('date.gregorian')}</span>
        <Switch
          // disabled={true}
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
      {dateTypeIsSelectable && dateTypeButtons()}
      <MuiPickersUtilsProvider
        utils={selectedDateType === 'fa' ? JalaliUtils : DateFnsUtils}
        // locale={selectedDateType}
      >
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
