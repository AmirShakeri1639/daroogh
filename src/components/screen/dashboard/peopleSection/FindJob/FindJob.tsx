import React, { useState, useEffect, useRef, useMemo, Fragment } from 'react'
import { useTranslation } from 'react-i18next';
import { FindJob as Job} from 'services/api';
import { FindJobInterface } from '../../../../../interfaces';

const FindJob : React.FC = () => {

    const [dataList, setDataList] = useState<FindJobInterface>();

    useEffect(() => {
        async function getData() {
          const { all } = new Job();
          const result = await all('dfb');

          setDataList(result);
        }
        getData();
      }, []);

    return (
        <>
        {console.log('jobs' , dataList)}
        </>
    )
}
export default FindJob;
