import { Chain } from 'types';

const sortChainList = (chainList: Chain[]) => {
  const sortedChainList = chainList.sort((a, b) => {
    if (a.totalClaimsSinceLastMonday < b.totalClaimsSinceLastMonday) {
      return 1;
    }
    if (a.totalClaimsSinceLastMonday > b.totalClaimsSinceLastMonday) {
      return -1;
    }
    return 0;
  });
  return sortedChainList;
};

export default sortChainList;
