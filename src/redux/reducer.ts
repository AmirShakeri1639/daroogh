import { Action } from './interface';

interface User {
  name: string;
}

const user = {
  name: '',
};

export const userReducer = (state: User = user, action: Action): User => {
  switch (action.type) {
    case 'SET_USER_NAME':
      return {
        ...state,
        name: action.value,
      };
    default:
      return state;
  }
};
