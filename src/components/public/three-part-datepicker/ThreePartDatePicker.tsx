import React, { useEffect, useReducer } from 'react';
import { createStyles, Grid, makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { ActionInterface } from 'interfaces';
import { isNullOrEmpty } from 'utils';
import NumberField from '../TextField/NumberField'

const useClasses = makeStyles((theme) =>
  createStyles({
    formItemSmall: {
      width: '5em',
      margin: theme.spacing(1)
    },
  })
);

interface Props {
  fullDate?: string;
  day?: string | number;
  month?: string | number;
  year?: string | number;
  label?: string;
  onChange?: (value: string, isValid: boolean) => void | void;
}

const initialState: Props = {
  fullDate: '',
  day: '',
  month: '',
  year: '',
  label: ''
}

function reducer(state = initialState, action: ActionInterface): any {
  const { value } = action;

  switch (action.type) {
    case 'day':
      return {
        ...state,
        day: value,
      };
    case 'month':
      return {
        ...state,
        month: value,
      };
    case 'year':
      return {
        ...state,
        year: value,
      };
    case 'fullDate':
      return {
        ...state,
        fullDate: value,
      };
    case 'selectedDate':
      return {
        ...state,
        selectedDate: value,
      };
    case 'isValid':
      return {
        ...state,
        isValid: value,
      };
    case 'reset':
      return initialState;
    default:
      console.error('Action type not defined');
  }
}

export const ThreePartDatePicker: React.FC<Props> = (props) => {
  const { t } = useTranslation();
  const [state, dispatch] = useReducer(reducer, {
    day: isNullOrEmpty(props.day) ? '' : props.day,
    month: isNullOrEmpty(props.month) ? '' : props.month,
    year: isNullOrEmpty(props.year) ? '' : props.year,
  });
  useEffect(() => {
    if ((isNullOrEmpty(props.day)
      || isNullOrEmpty(props.month)
      || isNullOrEmpty(props.year)
    ) && props.fullDate !== undefined && props?.fullDate?.length >= 8) {
      const { fullDate: full } = props;
      const yearLen = full.length === 10 ? 4 : 2;
      try {
        dispatch({ type: 'day', value: full.slice(-2) });
        dispatch({ type: 'month', value: full.slice(yearLen + 1, yearLen + 3) });
        dispatch({ type: 'year', value: full.slice(yearLen - 2, yearLen) });
      } catch { }
    }
  }, [props.fullDate])

  const {
    formItemSmall,
  } = useClasses();

  const setSelectedDate = (d: {
    day?: string; month?: string; year?: string;
  }): void => {
    let bdDay = d.day === undefined
      ? +state.day : d.day === '' ? 0 : +d.day;
    const bdMonth = d.month === undefined
      ? +state.month : d.month === '' ? 0 : +d.month;
    const bdYear = d.year === undefined
      ? +state.year : d.year === '' ? 0 : +d.year;
    bdDay = bdMonth > 6 && bdDay == 31 ? 30 : bdDay;
    bdDay = bdMonth == 12 && bdDay == 30 ? 29 : bdDay;

    const result = (
      bdYear > 0 && bdYear < 100
      && bdMonth > 0 && bdMonth < 13
      && bdDay > 0 && bdDay < 32
    )
      ? `${bdYear}/${bdMonth}/${bdDay}`
      : '';
    const isValid = result !== '' ||
      (bdDay === 0 && bdMonth === 0 && bdYear === 0);

    dispatch({ type: 'isValid', value: isValid });
    dispatch({ type: 'selectedDate', value: result });
    if (props.onChange) {
      props.onChange(result, isValid);
    }
  }

  return (
    <Grid item xs={ 12 }
      style={ { display: 'flex', alignItems: 'center' } }>
      <span style={{ whiteSpace: 'pre', margin: '0 .2em' }}>{ props.label }</span>
      <NumberField
        error={
          (state.day === '' && (state.month !== '' || state.year !== ''))
          || (state.day !== '' && (state.day < 1 || state.day > 31))
        }
        label={ t('general.day') }
        className={ formItemSmall }
        variant="outlined"
        value={ state.day }
        onChange={ (e: any): void => {
          e.target.value = e.target.value.substr(0, 2)
          if (e.target.value !== '') {
            if (+e.target.value < 1) e.target.value = '1'
            if (+e.target.value > 31) e.target.value = '31'
          }
          dispatch({ type: 'day', value: e.target.value })
          setSelectedDate({ day: e.target.value });
        } }
      />
      <NumberField
        error={
          (state.month === '' && (state.day !== '' || state.year !== ''))
          || (state.month !== '' && (state.month < 1 || state.month > 12))
        }
        label={ t('general.month') }
        className={ formItemSmall }
        variant="outlined"
        value={ state.month }
        onChange={ (e): void => {
          e.target.value = e.target.value.substr(0, 2)
          if (e.target.value !== '') {
            if (+e.target.value < 1) e.target.value = '1'
            if (+e.target.value > 12) e.target.value = '12'
          }
          if (+state.day > 29 && +e.target.value === 12) {
            dispatch({ type: 'day', value: '29' })
          }
          dispatch({ type: 'month', value: e.target.value })
          setSelectedDate({ month: e.target.value });
        } }
      />
      <NumberField
        error={
          (state.year === '' && (state.day !== '' || state.month !== ''))
          || (state.year !== '' && (state.year < 1 || state.year > 99))
        }
        label={ t('general.year') }
        className={ formItemSmall }
        variant="outlined"
        value={ state.year }
        onChange={ (e): void => {
          e.target.value = e.target.value.substr(0, 2)
          if (e.target.value !== '') {
            if (+e.target.value < 1) e.target.value = '1'
            if (+e.target.value > 99) e.target.value = '99'
          }
          dispatch({ type: 'year', value: e.target.value })
          setSelectedDate({ year: e.target.value });
        } }
      />
      <span style={{ margin: '0 .2em' }}>13</span>
    </Grid>
  )
}