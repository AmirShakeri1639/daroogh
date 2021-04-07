import { AllPharmacyDrugInterface } from 'interfaces';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PharmacyDrug } from 'services/api';

interface Props {
    pharmacyId: string|undefined;
  }


  const AllPharmacyDrugsViwer: React.FC<Props> = (props) => {
    const { pharmacyId } = props;
    const [dataList, setDataList] = useState<AllPharmacyDrugInterface>();

    useEffect(() => {
        async function getData() {
          const { allPharmacyDrug } = new PharmacyDrug();
          const result = await allPharmacyDrug(pharmacyId , true , `desc`);
          setDataList(result);
        }
        getData();
      }, []);

    return(<>
        {console.log('data' , dataList)}
    </>);
  }
  export default AllPharmacyDrugsViwer;