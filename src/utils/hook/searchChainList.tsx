import { Chain } from 'types';
import Fuse from 'fuse.js';

const searchChainList = (searchPhrase: string, chainList: Chain[]) => {
  if (searchPhrase === '') return chainList;
  const fuseOptions = {
    // isCaseSensitive: false,
    // includeScore: false,
    // shouldSort: true,
    // includeMatches: false,
    // findAllMatches: false,
    // minMatchCharLength: 1,
    // location: 0,
    threshold: 0.2, // threshoud is between 0 and 1 where 0 is strict and 1 is accepting anything
    // distance: 100,
    // useExtendedSearch: false,
    // ignoreLocation: false,
    // ignoreFieldNorm: false,
    // fieldNormWeight: 1,
    keys: ['nativeCurrencyName', 'chainName'],
  };
  const fuse = new Fuse(chainList, fuseOptions);
  return fuse.search(searchPhrase).flatMap((serachResult) => serachResult.item);
};

export default searchChainList;
