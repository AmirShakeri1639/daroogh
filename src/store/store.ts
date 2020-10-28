import { createStore, combineReducers } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { composeWithDevTools } from 'redux-devtools-extension';
import { userReducer } from './reducer';

const reducers = combineReducers({
  user: userReducer,
});

const persistConfig = {
  key: 'root',
  storage,
};

const _persistReducer = persistReducer(persistConfig, reducers);

export type AppState = ReturnType<typeof reducers>;

const store = createStore(
  _persistReducer,
  composeWithDevTools(),
);

const _persistStore = persistStore(store);

export default () => ({
  store,
  _persistStore,
});
