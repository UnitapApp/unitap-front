import React, { Suspense } from 'react';
import GasTapWrapper from 'pages/home';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Landing from 'pages/landing';

import NFT from 'pages/nft';
import About from 'pages/about';
import TokenTap from 'pages/token-tap';
import { UserProfileProvider } from './hooks/useUserProfile';
import RoutePath from 'routes';
import { RefreshContextProvider } from './context/RefreshContext';
import { ClaimProvider } from './hooks/useChainList';
import store from './state';
import { Provider } from 'react-redux';
import Web3Provider from 'components/Web3Provider';

import ConnectBrightIdModal from 'pages/home/components/ConnectBrightIdModal/connectBrightIdModal';
import BrightConnectionModal from 'pages/home/components/BrightConnectionModal/brightConnectionModal';
import ConnectMetamaskModal from 'pages/home/components/ConnectMetamaskModal/connectMetamaskModal';
import CreateBrightIdAccountModal from 'pages/home/components/CreateBrightIdAccountModal/createBrightIdAccountModal';
import { BlockNumberProvider } from 'lib/hooks/useBlockNumber';
import TokenTapProvider from 'hooks/token-tap/tokenTapContext';

import ApplicationUpdater from 'state/application/updater';
import TransactionUpdater from 'state/transactions/updater';
import UserUpdater from 'state/user/updater';
import { MulticallUpdater } from 'lib/state/multicall';
import ScrollToTop from 'components/basic/ScrollToTop/scrollToTop';
import PrizeTap from 'pages/prize-tap';
import PrizeTapProvider from 'hooks/prizeTap/prizeTapContext';
import { ErrorsProvider } from './context/ErrorsProvider';

import 'typeface-jetbrains-mono';
import Navbar from 'components/common/Navbar/navbar';
import GlobalContextProvider from 'hooks/useGlobalContext';
import LearnTap from 'pages/learn-tap';

const Fund = React.lazy(() => import('./pages/fund'));
const Donate = React.lazy(() => import('./pages/donate'));

function Updaters() {
	return (
		<>
			<UserUpdater />
			<ApplicationUpdater />
			<TransactionUpdater />
			<MulticallUpdater />
		</>
	);
}

function App() {
	return (
		<React.StrictMode>
			<Provider store={store}>
				<Web3Provider>
					<RefreshContextProvider>
						<ErrorsProvider>
							<UserProfileProvider>
								<GlobalContextProvider>
									<BrowserRouter>
										<BlockNumberProvider>
											<Updaters />
											<ScrollToTop>
												<Navbar />
												<Routes>
													<Route
														path={RoutePath.FAUCET}
														element={
															<ClaimProvider>
																<GasTapWrapper />
															</ClaimProvider>
														}
													/>
													<Route path={RoutePath.LEARN} element={<LearnTap />} />
													<Route
														path={RoutePath.FUND}
														element={
															<ClaimProvider>
																<Suspense>
																	<Fund />
																</Suspense>
															</ClaimProvider>
														}
													/>
													<Route path={RoutePath.LANDING} element={<Landing />} />
													<Route
														path={RoutePath.DONATE}
														element={
															<Suspense>
																<Donate />
															</Suspense>
														}
													/>
													<Route
														path={RoutePath.NFT}
														element={
															<ClaimProvider>
																<NFT />
															</ClaimProvider>
														}
													/>
													<Route path={RoutePath.ABOUT} element={<About />} />
													<Route
														path={RoutePath.PRIZE}
														element={
															<PrizeTapProvider>
																<PrizeTap />
															</PrizeTapProvider>
														}
													/>
													<Route
														path={RoutePath.TOKEN}
														element={
															<TokenTapProvider>
																<TokenTap />
															</TokenTapProvider>
														}
													/>
												</Routes>
											</ScrollToTop>
											<ConnectBrightIdModal />
											<BrightConnectionModal />
											<ConnectMetamaskModal />
											<CreateBrightIdAccountModal />
										</BlockNumberProvider>
									</BrowserRouter>
								</GlobalContextProvider>
							</UserProfileProvider>
						</ErrorsProvider>
					</RefreshContextProvider>
				</Web3Provider>
			</Provider>
		</React.StrictMode>
	);
}

export default App;
