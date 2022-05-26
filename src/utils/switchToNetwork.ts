import { ExternalProvider } from '@ethersproject/providers';
import { Chain } from 'types';
import { convertChainObjectToMetaMaskParams, formatChainId } from './index';

interface SwitchNetworkArguments {
  provider: ExternalProvider;
  chain: Chain;
}

const USER_DENIED_REQUEST_ERROR_CODE = 4001;
const UNRECOGNIZED_CHAIN_ERROR_CODE = 4902;

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
  } catch (error: any) {
    // 4902 is the error code for attempting to switch to an unrecognized chainId
    // @ts-ignore
    if (error.code === UNRECOGNIZED_CHAIN_ERROR_CODE) {
      try {
        await provider.request({
          method: 'wallet_addEthereumChain',
          params: convertChainObjectToMetaMaskParams(chain),
        });
      } catch (err: any) {
        if (err.code !== USER_DENIED_REQUEST_ERROR_CODE) {
          throw err;
        }
      }
      // metamask (only known implementer) automatically switches after a network is added
      // the second call is done here because that behavior is not a part of the spec and cannot be relied upon in the future
      // metamask's behavior when switching to the current network is just to return null (a no-op)
      try {
        await provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: formattedChainId }],
        });
      } catch (err: any) {
        if (err.code !== USER_DENIED_REQUEST_ERROR_CODE) {
          throw err;
        }
      }
    } else {
      throw error;
    }
  }
}
