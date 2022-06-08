import React from 'react';
import Home from 'pages/home';
import './App.css';
import { Web3Provider } from '@ethersproject/providers';
import { createWeb3ReactRoot, Web3ReactProvider } from '@web3-react/core';
import { NetworkContextName } from './constants/misc';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Fund from './pages/fund';
import Landing from 'pages/landing';
import { ChainListProvider } from 'hooks/useChainList';
import { UserProfileProvider } from './hooks/useUserProfile';

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
          <UserProfileProvider>
            <ChainListProvider>
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/fund" element={<Fund />} />
                  <Route path="/landing" element={<Landing />} />
                </Routes>
              </BrowserRouter>
            </ChainListProvider>
          </UserProfileProvider>
        </Web3ProviderNetwork>
      </Web3ReactProvider>
    </React.StrictMode>
  );
}

export default App;
