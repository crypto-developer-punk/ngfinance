/**
 * Caution: Consider this file when using react-scripts
 * 
 * You may delete this file and its occurrences from the project filesystem if you are using GatsbyJS or NextJS version
 */
import React from 'react';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { Provider } from "mobx-react";
import { Web3ReactProvider, createWeb3ReactRoot } from "@web3-react/core";
import { Web3Provider } from '@ethersproject/providers'

import Routes from './Routes';
import store from './store';

import 'react-lazy-load-image-component/src/effects/opacity.css';
import 'leaflet/dist/leaflet.css';
import 'assets/css/index.css';

import 'swiper/css/swiper.min.css';
import 'aos/dist/aos.css';

function getLibrary(provider) {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000
  return library;
}

const browserHistory = createBrowserHistory();

const App = () => {

  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Provider store={store}>
        <Router history={browserHistory}>
          <Routes />
        </Router>
      </Provider>
    </Web3ReactProvider>
  );
};

export default App;