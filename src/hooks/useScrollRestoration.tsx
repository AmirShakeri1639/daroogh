import { debounce } from "lodash";
import { useEffect } from "react";
import { QueryCache } from "react-query";

const useScrollRestoration = (pixelsBeforeEnd: number , el: HTMLElement | Window, queryKey: string, setter: (val: any) => void, cache?: QueryCache): void => {
  const func = (e: any): void => {
    const el = e.target;
    pixelsBeforeEnd = pixelsBeforeEnd === 0 ? 200: pixelsBeforeEnd;
    if (el.scrollHeight - el.scrollTop - pixelsBeforeEnd <= el.clientHeight) {
      setter((v: any) => v + 1);
      cache?.invalidateQueries(queryKey);
    }
  };

  useEffect(() => {
    if (el !== null) {
      el.addEventListener('scroll', debounce(func, 100), { capture: true });
  
      return (): void => el.removeEventListener('scroll', debounce(func, 100));
    }
  }, []);
};

export default useScrollRestoration;
