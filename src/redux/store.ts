import { createStore, combineReducers } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel1';
import { userReducer, transferReducer } from './reducers';
import { composeWithDevTools } from 'redux-devtools-extension';

const reduxPersistConfig = {
  key: 'root',
  storage,
  version: 0,
  stateReconciler: autoMergeLevel2,
};

const reducers = combineReducers({
  user: userReducer,
  transfer: transferReducer,
});

// @ts-ignore
const persistedReducer = persistReducer(reduxPersistConfig, reducers);

export type AppState = ReturnType<typeof reducers>;

export default (): any => {
  const store = createStore(persistedReducer, composeWithDevTools());
  const persistor = persistStore(store as any);
  return { store, persistor };
};
