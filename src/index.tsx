import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
import { MuiThemeProvider } from "@material-ui/core/styles";
import RTL, { theme } from "./RTL";
import './i18n';
import './assets/scss/main.scss';
import store from './store/store';
import { PersistGate } from 'redux-persist/integration/react';

const { _persistStore, store: _store } = store();

ReactDOM.render(
  <Provider store={_store}>
    <PersistGate persistor={_persistStore}>
      <RTL>
        <MuiThemeProvider theme={theme}>
          <React.StrictMode>
            <App />
          </React.StrictMode>
        </MuiThemeProvider>
      </RTL>
    </PersistGate>
  </Provider>,
  document.getElementById('root')
);

serviceWorker.unregister();
