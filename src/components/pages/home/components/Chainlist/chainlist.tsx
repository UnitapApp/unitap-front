import React, { useCallback, useContext, useEffect, useState } from 'react';
import styled from 'styled-components/';
import { DV } from 'components/basic/designVariables';
import { PrimaryOutlinedButton, SecondaryButton } from 'components/basic/Button/button';
import { Chain } from '../../../../../types';
import { ethers } from 'ethers';
import { switchToNetwork } from '../../../../../utils/switchToNetwork';
import useActiveWeb3React from '../../../../../hooks/useActiveWeb3React';
import Modal from '../../../../common/Modal/modal';
import { Spaceman } from '../../../../../constants/spaceman';
import ClaimModal from '../ClaimModal/claimModal';
import { getChainList } from '../../../../../api';
import { UserProfileContext } from '../../../../../hooks/useUserProfile';

// ###### Local Styled Components

const ChainCard = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 2px solid ${DV.colors.black};
  border-radius: ${DV.sizes.baseRadius * 1.5}px;
  background-color: #1e1e29;
  margin-bottom: ${DV.sizes.baseMargin * 2}px;
  padding: ${DV.sizes.basePadding * 3}px ${DV.sizes.basePadding * 6}px;

  img {
    width: 30px;
    position: absolute;
    padding: 38px ${DV.sizes.baseMargin * 1.5}px;
    display: flex;
    border-radius: ${DV.sizes.baseRadius * 1.5}px 0 0 ${DV.sizes.baseRadius * 1.5}px;
    left: -1px;
    bottom: 0;
    top: 1 -px;
    background-color: ${DV.colors.black};
  }

  p {
    color: white;

    &:first-child {
      margin-right: ${DV.sizes.baseMargin * 8}px;
    }
  }
`;
const ChainName = styled.p`
  margin-left: ${DV.sizes.baseMargin * 6}px;
`;

const Action = styled.div`
  display: flex;
  align-items: center;
`;

const ChainList = () => {
  const userProfile = useContext(UserProfileContext);

  const [chainList, setChainList] = useState<Chain[]>([]);
  useEffect(() => {
    let mounted = true;
    const fun = async () => {
      const newChainList = await getChainList(userProfile?.address);
      if (mounted) {
        setChainList(newChainList);
      }
    };

    fun();
    return () => {
      mounted = false;
    };
  }, [userProfile]);

  const [activeChain, setActiveChain] = React.useState<Chain | null>(null);

  const { library, active } = useActiveWeb3React();

  const formatBalance = useCallback((amount: number) => {
    const fw = ethers.utils.formatEther(amount);
    return Number(fw) < 0.000001 ? '< 0.000001' : fw;
  }, []);

  const changeNetwork = useCallback(
    async (chain: Chain) => {
      if (!library?.provider) return;
      if (!active) return;
      await switchToNetwork({ provider: library.provider, chain });
    },
    [active, library],
  );

  return (
    <>
      <div>
        {chainList.map((chain) => {
          return (
            <div key={chain.chainId}>
              <ChainCard>
                <img src={chain.logoUrl} alt="" />
                <ChainName>{chain.chainName}</ChainName>
                <p>
                  <span>Chain ID</span> {chain.chainId}
                </p>
                <p>
                  <span>Currency</span> {chain.symbol}
                </p>
                <Action>
                  <PrimaryOutlinedButton
                    disabled={!active}
                    mr={2}
                    onClick={() => {
                      setActiveChain(chain);
                    }}
                  >
                    Claim {formatBalance(chain.maxClaimAmount)} {chain.symbol}
                  </PrimaryOutlinedButton>
                  <SecondaryButton onClick={() => changeNetwork(chain)} disabled={!active}>
                    Add to MetaMask
                  </SecondaryButton>
                </Action>
              </ChainCard>
            </div>
          );
        })}
      </div>

      <Modal
        spaceman={Spaceman.BOTTOM_BIG}
        title="claim gas fee"
        isOpen={!!activeChain}
        closeModalHandler={() => {
          setActiveChain(null);
        }}
      >
        {activeChain && <ClaimModal chain={activeChain} />}
      </Modal>
    </>
  );
};

export default ChainList;
