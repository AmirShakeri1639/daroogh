import { useEffect, useState } from 'react';

type Value = Array<number> | Array<string> | Array<object> | string | number | object;

const useLocalStorage = (item: string, value?: Value): string | null => {
  const [storageValue, setStorageValue] = useState<string | null>(null);

  useEffect(() => {
    if (value !== undefined) {
      if (Array.isArray(value) || typeof value === 'object') {
        localStorage.setItem(item, JSON.stringify(value));
      } else if (typeof value === 'number') {
        localStorage.setItem(item, String(value));
      } else {
        localStorage.setItem(item, value);
      }
    } else if (localStorage.getItem(item) !== null) {
      setStorageValue(localStorage.getItem(item));
    } else {
      console.error(`Value of '${item}' is not exist in local storage`);
    }
  }, [item, value]);

  return storageValue;
};

export default useLocalStorage;
