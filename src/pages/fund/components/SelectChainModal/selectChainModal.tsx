import React, { FC } from 'react';

import { SelectChainModalWrapper } from './selectChainModal.style';
import { ModalSearch } from './modalSearch.style';
import ChainItem from './chainItem';

const SelectChainModal: FC = () => {
  const chains = [
    { id: 1, icon: 'assets/images/modal/gnosis-icon.svg', title: 'Gnosis Chain', selected: true },
    { id: 2, icon: 'assets/images/modal/idchain-icon.svg', title: 'ID-Chain', selected: false },
  ];

  const chainsList = chains.map((chain) => (
    <ChainItem key={chain.id} icon={chain.icon} title={chain.title} selected={chain.selected} onClick={() => {}}></ChainItem>
  ));

  return (
    <SelectChainModalWrapper>
      <ModalSearch placeholder="Search Network" width="100%" mb={2}></ModalSearch>
      <hr className='hr'/>
      {chainsList}
    </SelectChainModalWrapper>
  );
};

export default SelectChainModal;
