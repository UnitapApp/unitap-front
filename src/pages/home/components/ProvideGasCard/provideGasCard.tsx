import React, { useContext } from 'react';
import { LightOutlinedButton } from 'components/basic/Button/button';
import RoutePath from '../../../../routes';
import { Link } from 'react-router-dom';
import { ClaimContext } from 'hooks/useChainList';
import { Text } from 'components/basic/Text/text.style';
import { ProvideGasCardWrapper } from './provideGasCard.style';

const ProvideGasCard = () => {
  const [chainListIndex, setChainListIndex] = React.useState(0);
  const { chainList } = useContext(ClaimContext);

  setInterval(() => {
    if (chainListIndex > chainList.length - 5) {
      setChainListIndex(0);
    } else {
      setChainListIndex(chainListIndex + 4);
    }
  }, 10000);

  // if (chainList.length > 0) {
  if (true) {
    return (
      <ProvideGasCardWrapper>
        {/* <div className="provide-gas pb-4 sm:pb-0 w-full flex flex-col sm:flex-row items-center bg-gray40 border-2 border-gray30 rounded-xl">
      </div> */}
        {/* <section className={'flex flex-col md:flex-row'}>
          <div className="chain p-5 lg:w-36 xl:w-40 sm:border-r-2 border-r-gray30">
            <div className="chain__name flex mb-4 text-white">
              {chainList[chainListIndex].symbol}
              <Icon className="ml-2" iconSrc={chainList[chainListIndex].logoUrl} width="auto" height="22px" />
            </div>
            <p className="chain__info text-xs text-gray90 flex">
              balance: <span className="chain__info__balance text-white ml-1">1,322</span>
            </p>
          </div>
          <div className="chain p-5 lg:w-36 xl:w-40 sm:border-r-2 border-r-gray30">
            <div className="chain__name flex mb-4 text-white">
              {chainList[chainListIndex + 1].symbol}
              <Icon className="ml-2" iconSrc={chainList[chainListIndex + 1].logoUrl} width="auto" height="22px" />
            </div>
            <p className="chain__info text-xs text-gray90 flex">
              balance: <span className="chain__info__balance text-white ml-1">1,322</span>
            </p>
          </div>
        </section>
        <section className={'flex flex-col md:flex-row'}>
          <div className="chain p-5 lg:w-36 xl:w-40 sm:border-r-2 border-r-gray30">
            <div className="chain__name flex mb-4 text-white">
              {chainList[chainListIndex + 2].symbol}
              <Icon
                className="ml-2"
                iconSrc={chainList[chainListIndex + 2].logoUrl}
                width="auto"
                height="22px"
              />
            </div>
            <p className="chain__info text-xs text-gray90 flex">
              balance: <span className="chain__info__balance text-white ml-1">1,322</span>
            </p>
          </div>
          <div className="chain p-5 lg:w-36 xl:w-40 sm:border-r-2 border-r-gray30">
          <div className="chain__name flex mb-4 text-white">
          {chainList[(chainListIndex + 3) % chainList.length].symbol}
          <Icon
          className="ml-2"
                iconSrc={chainList[(chainListIndex + 3) % chainList.length].logoUrl}
                width="auto"
                height="22px"
              />
              </div>
            <p className="chain__info text-xs text-gray90 flex">
              balance: <span className="chain__info__balance text-white ml-1">1,322</span>
            </p>
          </div>
        </section> */}
        <Text fontSize="16" mb={0} mdMb={2}>
          <strong> Enjoying Unitap?</strong> Donate to help more users access this service
        </Text>
        <Link className="m-auto" to={RoutePath.FUND}>
          <LightOutlinedButton className={'!bg-gray00 !w-48 lg:!w-60'} fontSize="14" height="46px">
            Provide Gas Fee
          </LightOutlinedButton>
        </Link>
      </ProvideGasCardWrapper>
    );
  }

  return <></>;
};

export default ProvideGasCard;
