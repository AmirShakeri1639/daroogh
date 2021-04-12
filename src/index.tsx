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
import './crisp.css'

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

(window as any).$crisp = [];
(window as any).CRISP_WEBSITE_ID = 'ab43d0bb-c5a4-48c4-ac43-af2ff652c4fa';

(function () {
  var d = document;
  var s = d.createElement('script');

  s.src = 'https://client.crisp.chat/l.js';
  s.async = true;
  d.getElementsByTagName('head')[0].appendChild(s);
})();
