import { useEffect, useState } from 'react';

const useDebounce = (value: any, delay: number): any => {
  const [debouncedValue, setDebouncedValue] = useState<any>(null);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return (): void => {
      clearTimeout(timeoutId);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
