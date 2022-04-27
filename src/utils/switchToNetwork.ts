import { ExternalProvider } from '@ethersproject/providers';
import { Chain } from '../types';
import { convertChainObjectToMetaMaskParams, formatChainId } from './index';

interface SwitchNetworkArguments {
  provider: ExternalProvider;
  chain: Chain;
}

// provider.request returns Promise<any>, but wallet_switchEthereumChain must return null or throw
// see https://github.com/rekmarks/EIPs/blob/3326-create/EIPS/eip-3326.md for more info on wallet_switchEthereumChain
export async function switchToNetwork({ provider, chain }: SwitchNetworkArguments): Promise<null | void> {
  if (!provider.request) {
    return;
  }
  const formattedChainId = formatChainId(chain.chainId);
  try {
    await provider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: formattedChainId }],
    });
  } catch (error) {
    // 4902 is the error code for attempting to switch to an unrecognized chainId
    // @ts-ignore
    if (error.code === 4902) {
      await provider.request({
        method: 'wallet_addEthereumChain',
        params: convertChainObjectToMetaMaskParams(chain),
      });
      // metamask (only known implementer) automatically switches after a network is added
      // the second call is done here because that behavior is not a part of the spec and cannot be relied upon in the future
      // metamask's behavior when switching to the current network is just to return null (a no-op)
      try {
        await provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: formattedChainId }],
        });
      } catch (error) {
        console.debug('Added network but could not switch chains', error);
      }
    } else {
      throw error;
    }
  }
}
