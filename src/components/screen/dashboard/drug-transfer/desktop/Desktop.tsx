import React, { useState } from 'react';
import { ExchangeStatesEnum, CancellerEnum } from "../../../../../enum";
import { ExchangeInterface } from "../../../../../interfaces";
import { Grid } from "@material-ui/core";
import CardContainer from "../exchange/CardContainer";
import ExCardContent from "../exchange/ExCardContent";
import ToolBox from "../Toolbox";
import SearchInAList from "../SearchInAList";
import CircleLoading from "../../../../public/loading/CircleLoading";
import Button from "../../../../public/button/Button";
import ArrowRightAltIcon from "@material-ui/icons/ArrowRightAlt";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";
import { useTranslation } from "react-i18next";
import { useQueryCache } from "react-query";
import { useClasses } from "../../classes";
import { Exchange } from "../../../../../services/api";

const Desktop: React.FC = () => {
  const { t } = useTranslation();
  const queryCache = useQueryCache();
  const { paper } = useClasses();

  const { getDashboard } = new Exchange();

  const [exchanges, setExchanges] = useState<ExchangeInterface[]>([]);
  React.useEffect(() => {
    async function getExchanges() {
      const result = await getDashboard();
      setExchanges(result.items);
    }
    getExchanges();
    console.log('exchanges: ', exchanges);
  }, []);

  const cardListGenerator = (): JSX.Element[] | null => {
    return (
      [<h1>LIST OF EXCHANGES...</h1>]
    )
    if (exchanges && exchanges.length > 0) {
      return exchanges.map((item: any, index: number) => {
        return (
          <Grid item xs={ 12 } sm={ 4 } key={ index }>
            <div className={ paper }>
              <CardContainer
                basicDetail={
                  <ExCardContent
                    pharmacyDrug={ item }
                  />
                }
                isPack={ item.packID }
                pharmacyDrug={ Object.assign(item, { currentCnt: item.cnt }) }
                collapsableContent={ item.collapsableContent }
              />
            </div>
          </Grid>
        )
      });
    }

    return null;
  };

  return (
    <>
      <Grid item xs={ 9 }>
        <Grid container spacing={ 1 }>
          <Grid item xs={ 5 }>
            <ToolBox/>
          </Grid>
          <Grid item xs={ 7 }>
            <SearchInAList/>
          </Grid>
        </Grid>

        <Grid container spacing={ 1 }>
          { cardListGenerator() }
        </Grid>
      </Grid>
    </>
  );

}

export default Desktop;
