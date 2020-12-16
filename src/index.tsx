import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { MuiThemeProvider } from "@material-ui/core/styles";
import RTL, { theme } from "./RTL";
import './i18n';
import './assets/scss/main.scss';
import { QueryCache, ReactQueryCacheProvider } from 'react-query';
import './scrollbar.css';

const queryCache = new QueryCache({
  defaultConfig: {
    queries: {
      refetchOnWindowFocus: true,
    },
  },
});

ReactDOM.render(
  <ReactQueryCacheProvider queryCache={queryCache}>
    <RTL>
      <MuiThemeProvider theme={theme}>
        <App />
      </MuiThemeProvider>
    </RTL>
  </ReactQueryCacheProvider>,
  document.getElementById('root')
);

serviceWorker.unregister();
