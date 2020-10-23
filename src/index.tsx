import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { ReactQueryCacheProvider } from 'react-query';

ReactDOM.render(
  <ReactQueryCacheProvider>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ReactQueryCacheProvider>,
  document.getElementById('root')
);

serviceWorker.unregister();
