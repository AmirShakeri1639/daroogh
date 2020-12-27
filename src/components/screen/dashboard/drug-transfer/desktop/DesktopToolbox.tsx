import React, { useContext, useState } from 'react';
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
import { ExchangeStateEnum, SortTypesEnum } from '../../../../../enum';

/*
interface Props for dropdown {
  defaultValue: any;
  onChangeHandler: (value: string) => void;
  data: LabelValue[];
  label: string;
  className?: any;
  variant?: any;
}

*/

interface Props {
  onFilterChanged?: (v: number | string) => void;
  onSortSelected?: (field: string, sortType: SortTypesEnum) => void;
}

const DesktopToolbox: React.FC<Props> = (props) => {
  const { onFilterChanged, onSortSelected } = props;
  const { t } = useTranslation();
  const { ul, faIcons } = useClasses();

  const [sortField, setSortField] = useState('');
  const [sortType, setSortType] = useState<SortTypesEnum>(SortTypesEnum.ASC);
  const [selectedStateFiler, setSelectedStateFiler] = useState('');

  const onStateFilterSelected = (v: string): void => {
    setSelectedStateFiler(v);
    console.log('state selected in fitler: ', v);
    if (onFilterChanged) onFilterChanged(v);
  }

  const onSortChanged = (
      field: string, 
      sortType: SortTypesEnum = SortTypesEnum.ASC
    ): void => {
      setSortField(field);
      setSortType(sortType);
      if (onSortSelected) onSortSelected(field, sortType);
  }

  const statesFilterList: LabelValue[] = [];
  statesFilterList.push({ label: '', value: -1 });
  for (let idx = 1; idx <= ExchangeStateEnum.CONFIRMALL_AND_PAYMENTALL; idx++) {
    statesFilterList.push({ 
      label: t(`ExchangeStateEnum.${ExchangeStateEnum[idx]}`),
      value: idx
    });
  }

  return (
    <>
      <ul className={ ul }>
        <li>
          <span className="txt-xs position-relative">{ `${t('general.sortWith')}:` }</span>
        </li>
        <li>
          <FontAwesomeIcon icon={ faCalendar } className={ faIcons } />
          <span className="txt-xs position-relative">{ t('exchange.sendDate') }</span>
        </li>
        <li className="selected-item">
          <FontAwesomeIcon icon={ faCalendarAlt } className={ faIcons } />
          <span className="txt-xs position-relative">{ t('exchange.expirationCompletionDate') }</span>
        </li>
        <li>
          <FontAwesomeIcon icon={ faSignal } className={ faIcons } />
          <span className="txt-xs position-relative">{ t('exchange.state') }</span>
        </li>
        <li>&nbsp;</li>
        <li>
          <FontAwesomeIcon icon={ faSortAmountUpAlt } className={ faIcons } />
          <span className="txt-xs position-relative">{ t('general.ascending') }</span>
        </li>
        <li>
          <FontAwesomeIcon icon={ faSortAmountDown } className={ faIcons } />
          <span className="txt-xs position-relative">{ t('general.descending') }</span>
        </li>
      </ul>
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
            defaultValue="-1"
            onChangeHandler={onStateFilterSelected}
            data={statesFilterList}
          />
        </li>
      </ul>
    </>
  );
};

export default DesktopToolbox;
