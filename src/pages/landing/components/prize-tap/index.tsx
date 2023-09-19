import { getRafflesListAPI } from 'api';

const PrizeTapLandingLazy = async () => {
	const [PrizeTapLandingComponent, rafflesList] = await Promise.all([
		import('./page').then((res) => res.default),
		getRafflesListAPI(undefined),
	]);

	return {
		default: () => <PrizeTapLandingComponent rafflesList={rafflesList} />,
	};
};

export default PrizeTapLandingLazy;
