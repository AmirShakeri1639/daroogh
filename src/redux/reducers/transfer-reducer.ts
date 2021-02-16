import { Action } from '../interface';

interface Transfer {
  isStarted: boolean;
}

const transfer = {
  isStarted: false,
};

export const transferReducer = (
  state: Transfer = transfer,
  action: Action
): Transfer => {
  switch (action.type) {
    case 'SET_TRANSFER_START':
      return {
        ...state,
        isStarted: true,
      };
    case 'SET_TRANSFER_END':
      return {
        ...state,
        isStarted: false,
      };
    default:
      return state;
  }
};
