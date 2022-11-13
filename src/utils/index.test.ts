import { diffToNextMonday, getTxUrl } from './index';
import { Chain } from '../types';
import { TEST_ADDRESS_NEVER_USE_2 } from '../../cypress/utils/data';

describe('utils', () => {
  const chainList: Chain[] = [
    {
      pk: 1,
      chainName: 'Gnosis Chain (formerly xDai) Mocked',
      chainId: '100',
      nativeCurrencyName: 'xDai',
      symbol: 'xDAI',
      decimals: 18,
      explorerUrl: 'https://blockscout.com/xdai/mainnet',
      rpcUrl: 'https://rpc.gnosischain.com',
      logoUrl:
        'https://chainlist.org/_next/image?url=https%3A%2F%2Fdefillama.com%2Fchain-icons%2Frsz_xdai.jpg&w=32&q=75',
      maxClaimAmount: 10000000000000000,
      claimed: 'N/A',
      unclaimed: 'N/A',
      fundManagerAddress: TEST_ADDRESS_NEVER_USE_2,
      totalClaims: 2000,
      totalClaimsSinceLastMonday: 10,
    },
    {
      pk: 2,
      chainName: 'IDChain Mainnet Mocked',
      chainId: '74',
      nativeCurrencyName: 'Eidi',
      symbol: 'EIDI',
      decimals: 18,
      explorerUrl: 'https://explorer.idchain.one/',
      rpcUrl: 'https://idchain.one/rpc/',
      logoUrl: 'https://explorer.idchain.one/images/idchain-plain.svg',
      maxClaimAmount: 1000,
      claimed: 'N/A',
      unclaimed: 'N/A',
      fundManagerAddress: TEST_ADDRESS_NEVER_USE_2,
      totalClaims: 2000,
      totalClaimsSinceLastMonday: 10,
    },
  ];
  const txHash = '0xbc36789e7a1e281436464229828f817d6612f7b477d66591ff96a9e064bcc98a';
  test('diffToNextMonday sunday 22:42:05', () => {
    const sundayNight = new Date(1653864125012);
    expect(diffToNextMonday(sundayNight)).toEqual({
      days: '00',
      hours: '01',
      minutes: '17',
      seconds: '55',
    });
  });
  test('diffToNextMonday monday 01:32:07', () => {
    const mondayMorning = new Date(1653874327795);
    expect(diffToNextMonday(mondayMorning)).toEqual({
      days: '06',
      hours: '22',
      minutes: '27',
      seconds: '53',
    });
  });
  test('diffToNextMonday wednesday 00:00:00', () => {
    const wednesdayMidnight = new Date(1654041600000);
    expect(diffToNextMonday(wednesdayMidnight)).toEqual({
      days: '05',
      hours: '00',
      minutes: '00',
      seconds: '00',
    });
  });
  test('getTxUrl', () => {
    expect(getTxUrl(chainList[0], txHash)).toEqual(
      'https://blockscout.com/xdai/mainnet/tx/0xbc36789e7a1e281436464229828f817d6612f7b477d66591ff96a9e064bcc98a',
    );
  });
  test('getTxUrl has slash', () => {
    expect(getTxUrl(chainList[1], txHash)).toEqual(
      'https://explorer.idchain.one/tx/0xbc36789e7a1e281436464229828f817d6612f7b477d66591ff96a9e064bcc98a',
    );
  });
});
