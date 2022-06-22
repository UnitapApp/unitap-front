import { ExternalProvider } from '@ethersproject/providers';
import { Chain } from 'types';
import { convertChainObjectToMetaMaskParams, formatChainId } from './index';
import { UNRECOGNIZED_CHAIN_ERROR_CODE, USER_DENIED_REQUEST_ERROR_CODE } from './web3';

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
  } catch (error: any) {
    if (UNRECOGNIZED_CHAIN_ERROR_CODE.includes(error.code)) {
      let chainAdded = false;
      try {
        await provider.request({
          method: 'wallet_addEthereumChain',
          params: convertChainObjectToMetaMaskParams(chain),
        });
        chainAdded = true;
      } catch (err: any) {
        if (err.code !== USER_DENIED_REQUEST_ERROR_CODE) {
          if (err.message) {
            alert(err.message);
          }
          throw err;
        }
      }
      if (chainAdded) {
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
            if (err.message) {
              alert(err.message);
            }
            throw err;
          }
        }
      }
    } else {
      throw error;
    }
  }
}
