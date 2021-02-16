import { Action } from '../interface';

export const setTransferStart = (): Action => ({
  type: 'SET_TRANSFER_START',
  value: true,
});

export const setTransferEnd = (): Action => ({
  type: 'SET_TRANSFER_END',
  value: true,
});
