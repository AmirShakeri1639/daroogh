import React, { useState } from 'react';
import { useClasses } from '../../classes';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendar, faCalendarAlt,
} from '@fortawesome/free-regular-svg-icons';
import {
  faSignal, faSortAmountUpAlt, faSortAmountDown,
} from '@fortawesome/free-solid-svg-icons';
import { DaroogDropdown } from '../../../../public/daroog-dropdown/DaroogDropdown';
import { LabelValue } from '../../../../../interfaces';
import { ColorEnum, ExchangeStateEnum, SortTypeEnum } from '../../../../../enum';
import { Grid } from '@material-ui/core';
import { isExchangeCompleted } from '../../../../../utils/ExchangeTools';

interface Props {
  onFilterChanged?: (v: number) => void;
  onFilterClicked?: (v: any) => void;
  onSortSelected?: (field: string, sortType: SortTypeEnum) => void;
  filterList?: LabelValue[];
}

const DesktopToolbox: React.FC<Props> = (props) => {
  const { 
    onFilterChanged, 
    onSortSelected, 
    onFilterClicked,
    filterList 
  } = props;
  const { t } = useTranslation();
  const { ul, faIcons } = useClasses();

  const [sortField, setSortField] = useState('');
  const [sortType, setSortType] = useState<SortTypeEnum>(SortTypeEnum.ASC);
  const [selectedSortElement, setSelectedSortElement] = useState<HTMLElement | any>(null);
  const [selectedSortTypeElement, setSelectedSortTypeElement] = useState<HTMLElement | any>(null);
  const [selectedStateFiler, setSelectedStateFiler] = useState(0);


  const stateFilterSelected = (v: string): void => {
    setSelectedStateFiler(+v);
    if (onFilterChanged) onFilterChanged(+v);
  }

  const sortChanged = (field: string, el: any): void => {
    if (field === sortField) {
      field = '';
      el.className = '';
      setSelectedSortElement(null);
      setSortField('');
    } else {
      el.className = 'selected-item';
      if (selectedSortElement) {
        selectedSortElement.className = '';
      }
      setSelectedSortElement(el);
      setSortField(field);
    }
    setSortType(sortType);
    if (onSortSelected) onSortSelected(field, sortType);
  }

  const sortTypeChanged = (sType: SortTypeEnum = SortTypeEnum.ASC, el: any): void => {
    el.className = 'selected-item';
    if (selectedSortTypeElement) {
      selectedSortTypeElement.className = '';
    }
    setSelectedSortTypeElement(el);
    setSortType(sType);
    if (onSortSelected) onSortSelected(sortField, sType);
  }

  const statesFilterList: LabelValue[] = [];
  statesFilterList.push({ label: t('general.all'), value: ExchangeStateEnum.UNKNOWN });
  if (filterList == undefined) {
    for (let idx = 1; idx <= ExchangeStateEnum.CONFIRMALL_AND_PAYMENTALL; idx++) {
      if (!isExchangeCompleted(idx)) {
        statesFilterList.push({
          label: t(`ExchangeStateEnum.${ExchangeStateEnum[idx]}`),
          value: idx
        });
      }
    }
    statesFilterList.push({
      label: t('ExchangeStateEnum.CONFIRMALL_AND_PAYMENTALL'),
      value: ExchangeStateEnum.CONFIRMALL_AND_PAYMENTALL
    })
  } else {
    statesFilterList.push(...filterList);
  }

  return (
    <Grid container>
      <Grid item xs={ 12 } sm={ 6 }>
        <ul className={ ul }>
          <li>
            <span className="txt-xs position-relative">{ `${t('general.sortWith')}:` }</span>
          </li>
          <li onClick={ (e): void => sortChanged('sendDate', e.currentTarget) }>
            <FontAwesomeIcon icon={ faCalendar } className={ faIcons } />
            <span className="txt-xs position-relative">{ t('exchange.sendDate') }</span>
          </li>
          <li onClick={ (e): void => sortChanged('expireDate', e.currentTarget) }>
            <FontAwesomeIcon icon={ faCalendarAlt } className={ faIcons } />
            <span className="txt-xs position-relative">{ t('exchange.expirationCompletionDate') }</span>
          </li>
          <li onClick={ (e): void => sortChanged('state', e.currentTarget) }>
            <FontAwesomeIcon icon={ faSignal } className={ faIcons } />
            <span className="txt-xs position-relative">{ t('exchange.state') }</span>
          </li>
          <li>&nbsp;</li>
          <li onClick={ (e): void => sortTypeChanged(SortTypeEnum.ASC, e.currentTarget) }>
            <FontAwesomeIcon icon={ faSortAmountUpAlt } className={ faIcons } />
            <span className="txt-xs position-relative">{ t('general.ascending') }</span>
          </li>
          <li onClick={ (e): void => sortTypeChanged(SortTypeEnum.DESC, e.currentTarget) }>
            <FontAwesomeIcon icon={ faSortAmountDown } className={ faIcons } />
            <span className="txt-xs position-relative">{ t('general.descending') }</span>
          </li>
        </ul>
      </Grid>
      <Grid item xs={ 12 } sm={ 6 }>
        <ul className={ ul }>
          <li>
            <span className="txt-xs position-relative">{ `${t('general.filterWith')}:` }</span>
          </li>
          <li>
            <FontAwesomeIcon icon={ faSignal } className={ faIcons } />
            <span className="txt-xs position-relative">{ t('exchange.state') }</span>
          </li>
          <li>
            <DaroogDropdown
              defaultValue="0"
              onClick={ (v: any): void => {
                if (onFilterClicked) onFilterClicked(v);
               } }
              onChangeHandler={ stateFilterSelected }
              data={ statesFilterList }
              variant="standard"
              style={ { marginTop: '-.5em', color: ColorEnum.Silver } }
            />
          </li>
        </ul>
      </Grid>
    </Grid>
  );
};

export default DesktopToolbox;
