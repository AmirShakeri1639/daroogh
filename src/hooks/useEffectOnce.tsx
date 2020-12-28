import { EffectCallback, useEffect } from 'react';

const useEffectOnce = (callBack: EffectCallback): any => useEffect(callBack, []);

export default useEffectOnce;
