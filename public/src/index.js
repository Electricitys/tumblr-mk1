import React from 'react';
import ReactDOM from 'react-dom';

import 'normalize.css';
import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
import '@blueprintjs/select/lib/css/blueprint-select.css';
import '@blueprintjs/datetime/lib/css/blueprint-datetime.css';
import '@blueprintjs/popover2/lib/css/blueprint-popover2.css';
import './index.css';
import './ListGroup.css';

import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
import { ClientProvider } from './components/Client';
import { AccountProvider } from './components/Account';
import { Router } from './Router';
import { ThemeProvider } from '@emotion/react';

import theme from "./components/theme";

ReactDOM.render(
  // <React.StrictMode>
  <ThemeProvider theme={theme}>
    <ClientProvider>
      <AccountProvider>
        <Router />
      </AccountProvider>
    </ClientProvider>
  </ThemeProvider>
  // </React.StrictMode>
  , document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();
// serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
