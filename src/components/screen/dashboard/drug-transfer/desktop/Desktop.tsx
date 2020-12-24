import React, { useState } from 'react';
import { ExchangeStatesEnum, CancellerEnum } from '../../../../../enum';
import { ExchangeInterface } from '../../../../../interfaces';
import { Container, Grid } from '@material-ui/core';
import CardContainer from '../exchange/CardContainer';
import ExCardContent from '../exchange/ExCardContent';
import ToolBox from '../Toolbox';
import SearchInAList from '../SearchInAList';
import CircleLoading from '../../../../public/loading/CircleLoading';
import Button from '../../../../public/button/Button';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import { useTranslation } from 'react-i18next';
import { useQueryCache } from 'react-query';
import { useClasses } from '../../classes';
import { Exchange } from '../../../../../services/api';
import DesktopCardContent from './DesktopCardContent';
import TransferDrug from '../Transfer';

const Desktop: React.FC = () => {
  const { t } = useTranslation();
  const queryCache = useQueryCache();
  const { paper } = useClasses();

  const { getDashboard } = new Exchange();

  const [exchanges, setExchanges] = useState<ExchangeInterface[]>([]);
  React.useEffect(() => {
    async function getExchanges(): Promise<any> {
      const result = await getDashboard();
      if (result != undefined) {
        setExchanges(result.items);
      }
    }

    getExchanges();
  }, []);

  const [showTransfer, setShowTransfer] = useState(false);
  const [exchangeId, setExchangeId] = useState<number | undefined>(undefined);
  const [exchangeState, setExchangeState] = useState<number | undefined>(undefined);

  const cardClickHandler = (id: number | undefined, state: number | undefined = 1): void => {
    setExchangeState(state);
    setExchangeId(id);
    setShowTransfer(true);
  }

  const cardListGenerator = (): JSX.Element[] | null => {
    if (exchanges && exchanges.length > 0) {
      return exchanges.map((item, index) => {
        return (<Grid item xs={12} sm={6} md={4} xl={4} key={index}>
          <div className={paper}>
            <DesktopCardContent item={item} onCardClick={cardClickHandler} />
          </div>
        </Grid>);
      });
    }

    return null;
  };

  return (
    <>
      {showTransfer &&
        <TransferDrug viewExchangeId={exchangeId} exchangeState={exchangeState} />
      }
      {!showTransfer &&
        <Grid item xs={11}>
          <Grid container spacing={1}>
            <Grid item xs={5}>
              <ToolBox />
            </Grid>
            <Grid item xs={7}>
              <SearchInAList />
            </Grid>
          </Grid>

          <Grid container spacing={1}>
            {cardListGenerator()}
          </Grid>
        </Grid>
      }
    </>
  );
};

export default Desktop;

