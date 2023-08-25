import { getChainList } from 'api';
import { Chain } from 'types';

const GasTapLandingLazy = async () => {
	const [GasTapLandingComponent, chainList] = await Promise.all([
		import('./page').then((res) => res.default),
		getChainList(),
	]);

	return {
		default: ({ setChainClaims }: { setChainClaims: (chains: Chain[]) => void }) => (
			<GasTapLandingComponent chainList={chainList} setChainClaims={setChainClaims} />
		),
	};
};

export default GasTapLandingLazy;
