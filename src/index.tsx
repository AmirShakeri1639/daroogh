import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { MuiThemeProvider } from '@material-ui/core/styles';
import RTL, { theme } from './RTL';
import { QueryCache, ReactQueryCacheProvider } from 'react-query';
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import CircleLoading from './components/public/loading/CircleLoading';
import store from './redux/store';
import { SnackbarProvider } from 'notistack';
import './i18n';
import './assets/scss/main.scss';
import './scrollbar.css';
import './public-style.css';

const queryCache = new QueryCache({
  defaultConfig: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const { store: _store, persistor } = store();

ReactDOM.render(
  <ReduxProvider store={_store}>
    <PersistGate persistor={persistor} loading={<CircleLoading />}>
      <ReactQueryCacheProvider queryCache={queryCache}>
        <RTL>
          <MuiThemeProvider theme={theme}>
            <SnackbarProvider maxSnack={2}>
              <App />
            </SnackbarProvider>
          </MuiThemeProvider>
        </RTL>
      </ReactQueryCacheProvider>
    </PersistGate>
  </ReduxProvider>,
  document.getElementById('root')
);

serviceWorker.register();
