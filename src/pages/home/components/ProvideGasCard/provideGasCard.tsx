import React, { useContext, useEffect } from 'react';
import { LightOutlinedButton } from 'components/basic/Button/button';
import RoutePath from '../../../../routes';
import { Link } from 'react-router-dom';
import { ClaimContext } from 'hooks/useChainList';
import Icon from 'components/basic/Icon/Icon';
import ChainCard from './chainCard';

const ProvideGasCard = () => {
  const [chainListIndex, setChainListIndex] = React.useState(0);
  const { chainList } = useContext(ClaimContext);

  useEffect(() => {
    setTimeout(() => {
      if (chainListIndex > chainList.length - 5) {
        setChainListIndex(0);
      } else {
        setChainListIndex(chainListIndex + 4);
      }
    }, 10000);
  }, [chainListIndex, chainList]);

  if (chainList.length > 0) {
    return (
      <div className="provide-gas pb-4 sm:pb-0 w-full flex flex-col sm:flex-row items-center bg-gray40 border-2 border-gray30 rounded-xl">
        <section className={'flex flex-col md:flex-row'}>
          <ChainCard chain={chainList[chainListIndex]} />
          <ChainCard chain={chainList[(chainListIndex + 1) % chainList.length]} />
        </section>
        <section className={'flex flex-col md:flex-row'}>
          <ChainCard chain={chainList[(chainListIndex + 2) % chainList.length]} />
          <ChainCard chain={chainList[(chainListIndex + 3) % chainList.length]} />
        </section>
        <Link className="m-auto" to={RoutePath.FUND}>
          <LightOutlinedButton className={'!bg-gray00 !w-48 lg:!w-60'} fontSize="14" height="46px">
            Provide Gas Fee
          </LightOutlinedButton>
        </Link>
      </div>
    );
  }

  return <></>;
};

export default ProvideGasCard;
