import { EffectCallback, useEffect } from 'react';

const useEffectOnce = (callBack: EffectCallback) => useEffect(callBack, []);

export default useEffectOnce;
