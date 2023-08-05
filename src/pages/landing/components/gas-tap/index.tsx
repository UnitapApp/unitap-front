import { getChainList } from 'api';

const GasTapLandingLazy = async () => {
	const [GasTapLandingComponent, chainList] = await Promise.all([
		import('./page').then((res) => res.default),
		getChainList(),
	]);

	return {
		default: () => <GasTapLandingComponent chainList={chainList} />,
	};
};

export default GasTapLandingLazy;
