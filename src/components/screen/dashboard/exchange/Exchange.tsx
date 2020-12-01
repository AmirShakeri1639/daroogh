import React from 'react';
import { CardContainer } from '../../../public';
import ExCardContent from './ExCardContent';

const Exchange: React.FC = () => {
  const data = [
    {
      drugName: 'استامینوفن',
      inventory: 100,
      price: 10000,
      expireDate: '2020/12/01',
      offer: '1 به 3',
      isPack: false,
    },
    {
      drugName: 'کلداکس',
      inventory: 100,
      price: 50000,
      expireDate: '2020/08/01',
      offer: '1 به 3',
      isPack: false,
    },
    {
      drugName: 'سرماخوردگی',
      inventory: 100,
      price: 55000,
      expireDate: '2020/08/01',
      offer: '1 به 3',
      isPack: true,
      collapsableContent: "این بسته شامل"
    },
  ];
  return (
    <div>
      {data.map((item: any) => (
        <CardContainer
          basicDetail={
            <ExCardContent
              drugName={item.drugName}
              inventory={item.inventory}
              price={item.price}
              expireDate={item.expireDate}
              offer={item.offer}
            />
          }
          isPack={item.isPack}
          collapsableContent={item.collapsableContent}
        />
      ))}
    </div>
  );
};

export default Exchange;
