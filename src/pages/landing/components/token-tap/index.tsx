import { getTokensListAPI } from 'api';

const TokenTapLandingLazy = async () => {
	const [GasTapLandingComponent, tokensList] = await Promise.all([
		import('./page').then((res) => res.default),
		getTokensListAPI(),
	]);

	return {
		default: () => <GasTapLandingComponent tokensList={tokensList} />,
	};
};

export default TokenTapLandingLazy;
