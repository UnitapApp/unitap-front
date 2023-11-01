import { Chain } from 'types';

export const sortChainListByTotalClaimWeekly = (chainList: Chain[]) => {
	const sortedChainList = chainList.sort((a, b) => {
		if (a.totalClaims < b.totalClaims) {
			return 1;
		}
		if (a.totalClaims > b.totalClaims) {
			return -1;
		}
		return 0;
	});
	return sortedChainList;
};
