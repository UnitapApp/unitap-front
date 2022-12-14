import React from "react";
import Home from "pages/home";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Fund from "./pages/fund";
import Landing from "pages/landing";
import { UserProfileProvider } from "./hooks/useUserProfile";
import RoutePath from "routes";
import { RefreshContextProvider } from "./context/RefreshContext";
import { ClaimProvider } from "./hooks/useChainList";
import ApplicationUpdater from "state/application/updater";
import store from "./state";
import { Provider } from "react-redux";
import Web3Provider from "components/Web3Provider";
import About from "pages/about";

require("typeface-jetbrains-mono");

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
                    <Route path={RoutePath.ABOUT} element={<About />} />
                  </Routes>
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
