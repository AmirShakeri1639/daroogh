import React from 'react';

export interface IntersectionObserverProps {
  root?: any;
  target: any;
  onIntersect: (() => void) | void | any;
  threshold?: number;
  rootMargin?: string;
  enabled?: boolean;
}

export const useIntersectionObserver = (props: IntersectionObserverProps): any => {
  const {
    root,
    target,
    onIntersect,
    threshold = 1.0,
    rootMargin = '0px',
    enabled = true,
  } = props;

  React.useEffect(() => {
    if (!enabled) {
      return;
    }

    const observer = new IntersectionObserver(
      entries =>
        entries.forEach(entry => entry.isIntersecting && onIntersect()),
      {
        root: root && root.current,
        rootMargin,
        threshold,
      });

    const el = target && target.current;

    if (!el) {
      return;
    }
    observer.observe(el)
    return (): any => {
      observer.unobserve(el)
    }
  }, [target.current, enabled]);
}
