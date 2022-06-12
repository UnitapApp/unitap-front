import React, { useContext, useState } from 'react';

import { SelectChainModalWrapper } from './selectChainModal.style';
import { ModalSearch } from './modalSearch.style';
import ChainItem from './chainItem';
import { ChainListContext } from '../../../../hooks/useChainList';
import { getChainIcon } from '../../../../utils';
import { Chain } from '../../../../types';

const SelectChainModal = ({
  selectedChain,
  setSelectedChain,
  closeModalHandler,
}: {
  selectedChain: Chain | null;
  setSelectedChain: (chain: Chain) => any;
  closeModalHandler: () => any;
}) => {
  const [searchPhraseInput, setSearchPhraseInput] = useState<string>('');
  const { changeSearchPhrase, chainListSearchResult } = useContext(ChainListContext);
  const searchPhraseChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const phrase: string = event.target.value;
    setSearchPhraseInput(phrase);
    changeSearchPhrase!(phrase);
  };

  const chainsList = chainListSearchResult.map((chain) => (
    <ChainItem
      key={chain.chainId}
      icon={getChainIcon(chain)}
      title={chain.chainName}
      selected={selectedChain?.chainId === chain.chainId}
      onClick={() => {
        setSelectedChain(chain);
        closeModalHandler();
      }}
    ></ChainItem>
  ));

  return (
    <SelectChainModalWrapper>
      <ModalSearch
        value={searchPhraseInput}
        onChange={searchPhraseChangeHandler}
        placeholder="Search Network"
        width="100%"
        mb={2}
      ></ModalSearch>
      <hr className="hr" />
      {chainsList}
    </SelectChainModalWrapper>
  );
};

export default SelectChainModal;