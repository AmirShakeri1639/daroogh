import React, { useState, useEffect, useRef, useMemo, Fragment } from 'react'
import { useTranslation } from 'react-i18next';
import { FindJob as Job} from 'services/api';
import { FindJobInterface } from '../../../../../interfaces';

const FindJob : React.FC = () => {

    const [dataList, setDataList] = useState<FindJobInterface>();

    const [countryDivisionCode ,setCountryDivisionCode] = useState<string>('');

    useEffect(() => {
        async function getData() {
          const { all } = new Job();
          const result = await all('09');

          setDataList(result);
        }
        getData();
      }, []);

    return (
        <>
        {dataList && (console.log('jobs' , dataList.items[0].pharmacy.name))}
        
        </>
    )
}
export default FindJob;
