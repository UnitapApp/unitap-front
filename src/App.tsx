import React from 'react';
import Home from 'pages/home';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Fund from './pages/fund';
import Landing from 'pages/landing';
import Donate from 'pages/donate';
import NFT from 'pages/nft';
import About from 'pages/about';
import { UserProfileProvider } from './hooks/useUserProfile';
import RoutePath from 'routes';
import { RefreshContextProvider } from './context/RefreshContext';
import { ClaimProvider } from './hooks/useChainList';
import ApplicationUpdater from 'state/application/updater';
import store from './state';
import { Provider } from 'react-redux';
import Web3Provider from 'components/Web3Provider';

import ConnectBrightIdModal from 'pages/home/components/ConnectBrightIdModal/connectBrightIdModal';
import BrightConnectionModal from 'pages/home/components/BrightConnectionModal/brightConnectionModal';
import ConnectMetamaskModal from 'pages/home/components/ConnectMetamaskModal/connectMetamaskModal';
import CreateBrightIdAccountModal from 'pages/home/components/CreateBrightIdAccountModal/createBrightIdAccountModal';

require('typeface-jetbrains-mono');

function Updaters() {
  return (
    <>
      <ApplicationUpdater />
    </>
  );
}

function App() {
  return (
    <React.StrictMode>
      <Provider store={store}>
        <Web3Provider>
          <RefreshContextProvider>
            <UserProfileProvider>
              <ClaimProvider>
                <BrowserRouter>
                  <Updaters />
                  <Routes>
                    <Route path={RoutePath.FAUCET} element={<Home />} />
                    <Route path={RoutePath.FUND} element={<Fund />} />
                    <Route path={RoutePath.LANDING} element={<Landing />} />

                    <Route path={RoutePath.DONATE} element={<Donate />} />
                    <Route path={RoutePath.NFT} element={<NFT />} />
                    <Route path={RoutePath.ABOUT} element={<About />} />
                  </Routes>
                  <ConnectBrightIdModal />
                  <BrightConnectionModal />
                  <ConnectMetamaskModal />
                  <CreateBrightIdAccountModal />
                </BrowserRouter>
              </ClaimProvider>
            </UserProfileProvider>
          </RefreshContextProvider>
        </Web3Provider>
      </Provider>
    </React.StrictMode>
  );
}

export default App;
