import Icon from 'components/basic/Icon/Icon';
import SearchInput from './components/SearchInput/searchInput';

const TokenTapLoading = () => {
	return (
		<div>
			<div className="bg-gray60 h-[202px] rounded-2xl flex flex-col md:flex-row lg:items-end md:justify-between overflow-hidden relative p-4 mb-5 border-4 border-gray20">
				<div className="header-left z-10 flex flex-col items-start">
					<div className="h-12 w-[140px] bg-gray70 rounded-lg"></div>
					<div className="h-5 mt-2 w-[240px] bg-gray70 rounded-lg"></div>
				</div>
				<div className="flex flex-col mt-2 items-center absolute bottom-0 left-1/2 -translate-x-1/2 bg-gray70 w-68 h-16 py-2 px-4 rounded-t-lg"></div>

				<div className="flex justify-center md:justify-start mt-2">
					<div className="claim-stat__claimed rounded-lg bg-gray70 py-[2px] px-3 flex gap-x-3">
						<img src="/assets/images/token-tap/coins-loading.svg" alt="loading" />
					</div>
				</div>
				<div className="absolute w-96 h-[500px] animate-skeleton -top-40 z-10 opacity-20 rotate-[21.574deg] blur-2xl bg-[#797992]"></div>
			</div>
			<div className="action-bar flex flex-col-reverse md:flex-row justify-between items-center">
				<SearchInput className="w-full sm:w-1/2 md:w-1/3" />
			</div>
			<div className="mt-4"></div>
			{Array.from(new Array(12)).map((_, key) => (
				<TokenCardLoading key={key} />
			))}
		</div>
	);
};

const TokenCardLoading = () => {
	return (
		<div className="bg-gray60 mt-4 flex flex-col rounded-xl w-full relative overflow-hidden">
			<div className="flex gap-4 flex-col sm:flex-row justify-between pl-3 pr-6 pt-4">
				<span className="flex w-full items-start justify-center sm:justify-start gap-3">
					<span className="w-11 h-11 bg-gray70 rounded-full"></span>
					<div className="flex-col flex gap-3">
						<p className="rounded-lg h-5 w-72 max-w-full bg-gray70"></p>
						<p className="rounded-lg h-4 w-40 bg-gray70"></p>
					</div>
				</span>

				<span className="flex flex-col w-full items-start sm:justify-end sm:flex-row gap-2 sm:gap-4">
					<span className="bg-gray70 w-24 h-11 rounded-lg"></span>
					<span className="bg-gray70 border-2 border-gray80 w-56 h-11 rounded-lg"></span>
				</span>
			</div>

			<div className="pl-16 pr-6 py-2">
				<p className="rounded-lg h-4 w-full bg-gray70"></p>
				<p className="rounded-lg h-3 mt-3 w-88 max-w-full bg-gray70"></p>
				<div className={`py-3 flex mt-3 items-center flex-wrap text-xs gap-2 text-white`}>
					{Array.from(new Array(7)).map((_, key) => (
						<div className="bg-gray70 w-28 h-6 px-3 py-2 rounded-lg" key={key}></div>
					))}
				</div>
			</div>

			<div className="flex flex-col bg-gray50 sm:flex-row justify-center items-center px-9">
				<span className="flex justify-between items-center w-full sm:justify-center">
					<div className="bg-gray40 ml-auto py-2.5 px-6 h-full">
						<p className="bg-gray70 rounded-lg h-5 w-32"></p>
					</div>
					<div className="ml-auto flex gap-x-6 items-center">
						<Icon
							className="cursor-pointer"
							iconSrc="assets/images/token-tap/twitter-icon.svg"
							width="auto"
							height="20px"
						/>
						<Icon
							className="cursor-pointer"
							iconSrc="assets/images/token-tap/discord-icon.svg"
							width="auto"
							height="20px"
						/>
					</div>
				</span>
			</div>

			<div className="absolute w-96 h-[500px] animate-skeleton -top-40 z-10 opacity-20 rotate-[21.574deg] blur-2xl bg-[#797992]"></div>
		</div>
	);
};

export default TokenTapLoading;
