import { AnyAction } from "redux";

const userData = {
  name: '',
  family: '',
};

export const userReducer = (state = userData, action: AnyAction): any => {
  switch (action.type) {
    case 'name':
      return {
        ...state,
      };
    default:
      return state;
  }
}
