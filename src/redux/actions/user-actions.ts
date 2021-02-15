import { Action } from '../interface';

export const setUserName = (name: string): Action => ({
  type: 'SET_USER_NAME',
  value: name,
});
