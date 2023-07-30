import { useContext } from 'react';

import ChainList from './components/Chainlist/chainlist';
import Navbar from 'components/common/Navbar/navbar';
import Header from 'pages/home/components/Header/header';
import Footer from '../../components/common/Footer/footer';
import ProvideGasCard from './components/ProvideGasCard/provideGasCard';
import SearchInput from './components/SearchInput/searchInput';
import ClaimModal from './components/ClaimModal/claimModal';
import { Network } from 'types';
import { ClaimContext } from 'hooks/useChainList';
import { ChainType } from 'types';
import ClaimNonEVMModal from './components/ClaimNonEVMModal/claimNonEVMModal';

const Home = () => {
	const { searchPhrase } = useContext(ClaimContext);

	return (
		<>
			<Navbar />
			<div className="content-wrapper">
				<Header />
				<div className="action-bar flex flex-col-reverse md:flex-row justify-between items-center">
					<SearchInput className="w-full sm:w-1/2 md:w-1/3" />
					{searchPhrase === '' && <Filters />}
				</div>
				<ChainList />
				<p className="provide-gas-title text-white text-xl mr-auto mb-3">GasTap Chains Balances</p>
				<ProvideGasCard />
			</div>
			<ClaimModal />
			<ClaimNonEVMModal />
			<Footer />
		</>
	);
};

const Filters = () => {
	const { selectedNetwork, setSelectedNetwork } = useContext(ClaimContext);
	const { selectedChainType, setSelectedChainType } = useContext(ClaimContext);

	return (
		<div className="flex flex-col w-full sm:w-auto sm:flex-row gap-2 sm:gap-0 mb-2 md:mb-0 justify-between md:justify-end items-center md:ml-auto">
			<div className="switch flex items-center border-2 border-gray30 bg-gray30 rounded-xl w-full sm:w-auto">
				<div
					className={`switch__option w-full sm:w-[72px] px-1 py-3 text-center text-xs cursor-pointer rounded-l-[11px] ${
						selectedChainType === ChainType.ALL ? `text-white bg-gray50` : `text-gray80`
					}`}
					onClick={() => {
						setSelectedChainType(ChainType.ALL);
					}}
				>
					ALL
				</div>
				<div
					className={`switch__option w-full sm:w-[72px] px-1 py-3 text-center text-xs cursor-pointer ${
						selectedChainType === ChainType.EVM ? `text-white bg-gray50` : `text-gray80`
					}`}
					onClick={() => {
						setSelectedChainType(ChainType.EVM);
					}}
				>
					EVM
				</div>
				<div
					className={`switch__option w-full sm:w-[72px] px-1 py-3 text-center text-xs border-l-2 border-l-gray30 cursor-pointer rounded-r-[11px] ${
						selectedChainType === ChainType.NONEVM ? `text-white bg-gray50` : `text-gray80`
					}`}
					onClick={() => {
						setSelectedChainType(ChainType.NONEVM);
					}}
				>
					nonEVM
				</div>
			</div>
			<div className="switch flex items-center border-2 border-gray30 bg-gray30 rounded-xl w-full sm:w-auto sm:ml-3">
				<div
					className={`switch__option w-full sm:w-[72px] px-1 py-3 text-center text-xs cursor-pointer rounded-l-[11px] ${
						selectedNetwork === Network.ALL ? `text-white bg-gray50` : `text-gray80`
					}`}
					onClick={() => {
						setSelectedNetwork(Network.ALL);
					}}
				>
					ALL
				</div>
				<div
					className={`switch__option w-full sm:w-[72px] px-1 py-3 text-center text-xs cursor-pointer ${
						selectedNetwork === Network.MAINNET ? `text-white bg-gray50` : `text-gray80`
					}`}
					onClick={() => {
						setSelectedNetwork(Network.MAINNET);
					}}
				>
					Mainnets
				</div>
				<div
					className={`switch__option w-full sm:w-[72px] px-1 py-3 text-center text-xs border-l-2 border-l-gray30 rounded-r-[11px] cursor-pointer ${
						selectedNetwork === Network.TESTNET ? `text-white bg-gray50` : `text-gray80`
					}`}
					onClick={() => {
						setSelectedNetwork(Network.TESTNET);
					}}
				>
					Testnets
				</div>
			</div>
		</div>
	);
};

export default Home;
