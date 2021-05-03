import { AllPharmacyDrug } from 'enum';
import { useScrollRestoration } from 'hooks';
import { AllPharmacyDrugInterface } from 'interfaces';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useQueryCache } from 'react-query';
import { PharmacyDrug } from 'services/api';
import { isNullOrEmpty } from 'utils';
import { DaroogSearchBar } from './DaroogSearchBar';
import ItemContainer from './first-step/ItemContainer';

interface Props {
  pharmacyId: string;
}

const AllPharmacyDrugsViwer: React.FC<Props> = (props) => {
  const { pharmacyId } = props;
  const { getAllPharmacyDrug } = new PharmacyDrug();

  const [dataList, setDateList] = useState<AllPharmacyDrugInterface[]>([]);
  const [dataListD, setDateListD] = useState<AllPharmacyDrugInterface[]>([]);
  const [filterdList, setFilterdList] = useState<AllPharmacyDrugInterface[]>([]);

  const [isFinished, setIsFinished] = useState<boolean>(false);

  const [searchContent, setSearchContent] = useState<string>('');

  const [currentPage, setCurrentPage] = useState(0);
  const contentHandler = () => {
    return (
      <>
        <div style={{ position: 'sticky', left: '0', right: '0', top: '0' }}>
          <DaroogSearchBar onValueChange={(v: string): void => setSearchContent(v)} />
        </div>
        {dataListD && (
          <>
            {React.Children.toArray(
              dataListD.map((item: any) => (
                <>
                  <ItemContainer
                    drugGenericName={item.drug.name}
                    cnt={item.cnt}
                    offer2={item.offer2}
                    offer1={item.offer1}
                    price={item.amount}
                    expireDate={item.expireDate}
                  />
                </>
              ))
            )}
          </>
        )}
      </>
    );
  };
  const memoContent = useMemo(() => contentHandler(), [dataListD]);

  const scrollRestoration = useScrollRestoration;
  const cache = useQueryCache();

  scrollRestoration(20, window, AllPharmacyDrug.GET_ALL_PHARMACY_DRUG, setCurrentPage, cache);

  const { refetch } = useQuery(
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

  useEffect(() => {
    if (currentPage === 0 || !isFinished) {
      setDateListD((v) => [...v, ...filterdList.slice(currentPage * 50, currentPage * 50 + 50)]);
      setIsFinished(filterdList.length - (currentPage - 1) * 50 <= 50);
    }
  }, [currentPage, filterdList]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(
      () => {
        setIsFinished(false);
        setDateListD([]);
        setCurrentPage(0);
        if (searchContent !== '') {
          setFilterdList(
            dataList.filter((p) => {
              return (
                (p.drug.name && p.drug.name.includes(searchContent)) ||
                (p.drug.companyName && p.drug.companyName?.includes(searchContent)) ||
                (p.drug.genericName && p.drug.genericName?.includes(searchContent))
              );
            })
          );
        } else {
          setFilterdList(dataList);
        }
      },
      searchContent === '' ? 0 : 1000
    );
    return () => clearTimeout(delayDebounceFn);
  }, [searchContent, dataList]);

  return <>{memoContent}</>;
};
  export default AllPharmacyDrugsViwer;