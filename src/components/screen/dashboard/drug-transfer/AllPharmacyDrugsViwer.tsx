import { AllPharmacyDrug } from 'enum';
import { AllPharmacyDrugInterface } from 'interfaces';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { PharmacyDrug } from 'services/api';
import ItemContainer from './first-step/ItemContainer';

interface Props {
    pharmacyId: string;
  }


  const AllPharmacyDrugsViwer: React.FC<Props> = (props) => {
    const { pharmacyId } = props;
    const { getAllPharmacyDrug } = new PharmacyDrug();
    
    const [dataList , setDateList] = useState<AllPharmacyDrugInterface[]>();

    const {  refetch } = useQuery(
      AllPharmacyDrug.GET_ALL_PHARMACY_DRUG,
      () => {
        return getAllPharmacyDrug(pharmacyId);
      },
      {
        onSuccess: (data) => {
          setDateList(data.items);
          
        },
        enabled: false,
      }
    );

    
    useEffect(() => {
        refetch();
      }, []);

    return(<>

          {dataList && (<>
          {React.Children.toArray(
            dataList.map((item: any) => (<>
              <ItemContainer
                drugGenericName={item.drug.name}
                cnt={item.cnt}
                offer2={item.offer2}
                offer1={item.offer1}
                price={item.amount}
                expireDate={item.expireDate}
              /></>
            ))
          )}
          </>)}
          
     

    </>);
  }
  export default AllPharmacyDrugsViwer;