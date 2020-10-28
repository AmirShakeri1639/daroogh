import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { MuiThemeProvider } from "@material-ui/core/styles";
import RTL, { theme } from "./RTL";
import './i18n';
import './assets/scss/main.scss';
import { QueryCache, ReactQueryCacheProvider } from 'react-query';

const queryCache = new QueryCache();

ReactDOM.render(
  <ReactQueryCacheProvider queryCache={queryCache}>
    <RTL>
      <MuiThemeProvider theme={theme}>
        <React.StrictMode>
          <App />
        </React.StrictMode>
      </MuiThemeProvider>
    </RTL>
  </ReactQueryCacheProvider>,
  document.getElementById('root')
);

serviceWorker.unregister();
