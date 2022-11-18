import React from 'react';
import Home from 'pages/home';
import './App.css';
import { Web3Provider } from '@ethersproject/providers';
import { createWeb3ReactRoot, Web3ReactProvider } from '@web3-react/core';
import { NetworkContextName } from './constants/misc';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Fund from './pages/fund';
import Landing_deprecated from 'pages/landing';
import Landing from 'pages/landing';
import { UserProfileProvider } from './hooks/useUserProfile';
import RoutePath from 'routes';
import Web3ReactManager from './components/Web3ReactManager';
import { RefreshContextProvider } from './context/RefreshContext';
import { ClaimProvider } from './hooks/useChainList';

require('typeface-jetbrains-mono');

const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName);

function getLibrary(provider: any) {
  return new Web3Provider(provider);
}

function App() {
  return (
    <React.StrictMode>
      <Web3ReactProvider getLibrary={getLibrary}>
        <Web3ProviderNetwork getLibrary={getLibrary}>
          <Web3ReactManager>
            <RefreshContextProvider>
              <UserProfileProvider>
                <ClaimProvider>
                  <BrowserRouter>
                    <Routes>
                      <Route path={RoutePath.FAUCET} element={<Home />} />
                      <Route path={RoutePath.FUND} element={<Fund />} />
                      <Route path={RoutePath.LANDING} element={<Landing />} />
                    </Routes>
                  </BrowserRouter>
                </ClaimProvider>
              </UserProfileProvider>
            </RefreshContextProvider>
          </Web3ReactManager>
        </Web3ProviderNetwork>
      </Web3ReactProvider>
    </React.StrictMode>
  );
}

export default App;
