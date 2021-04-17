import React from 'react';

const getDrugName = (item: any): string => {
  return `${item.name}${item.genericName !== null ? ` (${item.genericName}) ` : ''}${item.type !== null ? ` - ${item.type}` : ''
    }`;
};

type Item = {
  item: {
    value: number;
    label: string;
  };
  el: JSX.Element;
};

export default (items: any[]): Item[] => {
  return items.map((_item: any) => ({
    item: {
      value: _item.id,
      label: getDrugName(_item),
    },
    el: (
      <div>
        <div>{ getDrugName(_item) }</div>
        <div className="text-muted txt-sm no-farsi-number">{
          `${_item.enName !== null
            ? `-${_item.enName}` : ''}${_item.companyName !== null ? ` - ${_item.companyName}`
              : ''
          }` }</div>
      </div>
    ),
  }));
};
