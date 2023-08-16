import Header from './components/Header/Header';
import Footer from 'components/common/Footer/footer';
import TokensList from './components/TokensList/TokensList';
import SearchInput from './components/SearchInput/searchInput';
import ClaimTokenModal from './components/ClaimTokenModal';
import BrightConnectionModal from 'pages/home/components/BrightConnectionModal/brightConnectionModal';
import { useContext } from 'react';
import { TokenTapContext } from 'hooks/token-tap/tokenTapContext';
import TokenTapLoading from './loading';

const TokenTap = () => {
	const { tokensList } = useContext(TokenTapContext);

	return (
		<>
			<div className="content-wrapper">
				{!tokensList.length ? (
					<TokenTapLoading />
				) : (
					<>
						<Header />
						<SearchInput className="mt-1 lg:mt-0 w-full md:w-1/3" />
						<TokensList />
					</>
				)}
			</div>
			<Footer />

			<ClaimTokenModal />
			<BrightConnectionModal />
		</>
	);
};

export default TokenTap;
