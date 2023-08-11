import { Filters } from 'pages/home/page';
import SearchInput from './components/SearchInput/searchInput';
import { ClaimContext } from 'hooks/useChainList';
import { useContext } from 'react';

const GasTapLoading = () => {
	const { searchPhrase } = useContext(ClaimContext);

	return (
		<div>
			<div className="bg-gray60 h-[202px] rounded-2xl flex flex-col md:flex-row lg:items-end md:justify-between overflow-hidden relative p-4 mb-5 border-4 border-gray20">
				<div className="header-left z-10 flex flex-col items-start">
					<div className="h-12 w-[140px] bg-gray70 rounded-lg"></div>
				</div>
				<div className="flex flex-col mt-2 items-center absolute bottom-0 left-1/2 -translate-x-1/2 bg-gray70 w-68 h-16 py-2 px-4 rounded-t-lg"></div>

				<div className="flex flex-wrap justify-center md:justify-start mt-2">
					<div className="claim-stat__claimed rounded-lg bg-gray70 py-[2px] px-3 items-start h-14 flex gap-x-3">
						<img className="w-full" src="/assets/images/gas-tap/dabe-loading.svg" alt="loading" />
					</div>
				</div>
				<div className="absolute w-96 h-[400px] animate-skeleton -top-40 z-10 opacity-20 rotate-[21.574deg] blur-2xl bg-[#797992]"></div>
			</div>
			<div className="action-bar flex flex-col-reverse md:flex-row justify-between items-center">
				<SearchInput className="w-full sm:w-1/2 md:w-1/3" />
				{searchPhrase === '' && <Filters />}
			</div>
			<div className="mt-4"></div>
			{Array.from(new Array(12)).map((_, key) => (
				<GasCardLoading key={key} />
			))}
		</div>
	);
};

const GasCardLoading = () => {
	return (
		<div className="bg-gray60 mt-4 flex flex-col rounded-xl w-full relative overflow-hidden">
			<div className="flex gap-4 flex-col sm:flex-row justify-between pl-3 pr-6 py-4">
				<span className="flex w-full items-center justify-center sm:justify-start gap-3">
					<span className="w-11 h-11 bg-gray70 rounded-full"></span>
					<p className="rounded-lg h-6 w-20 bg-gray70"></p>
					<p className="rounded-lg h-5 w-14 bg-gray70"></p>
					<p className="rounded-lg h-5 w-14 bg-gray70"></p>
				</span>
				<span className="flex flex-col w-full items-center sm:justify-end sm:flex-row gap-2 sm:gap-4">
					<span className="bg-gray70 w-24 h-11 rounded-lg"></span>
					<span className="bg-gray70 border-2 border-gray80 w-56 h-11 rounded-lg"></span>
				</span>
			</div>
			<div className="flex flex-col bg-gray50 sm:flex-row justify-between items-center py-2.5 px-9">
				<span className="flex justify-between items-center w-full sm:justify-start">
					<p className="bg-gray70 rounded-lg h-5 w-12"></p>
					<p className="bg-gray70 rounded-lg h-6 w-24 ml-4"></p>
				</span>
				<span className="flex justify-between items-center w-full sm:justify-center">
					<p className="bg-gray70 rounded-lg h-5 w-12"></p>
					<p className="bg-gray70 rounded-lg h-6 w-24 ml-4"></p>
				</span>
				<span className="flex justify-between items-center w-full sm:justify-end">
					<p className="bg-gray70 rounded-lg h-5 w-12"></p>
					<p className="bg-gray70 rounded-lg h-6 w-24 ml-4"></p>
				</span>
			</div>

			<div className="absolute w-96 h-[500px] animate-skeleton -top-40 z-10 opacity-20 rotate-[21.574deg] blur-2xl bg-[#797992]"></div>
		</div>
	);
};

export default GasTapLoading;
