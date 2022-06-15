// ***********************************************
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

import { JsonRpcProvider } from '@ethersproject/providers';
import { Wallet } from '@ethersproject/wallet';
import { formatChainId } from '../../../src/utils';

import { TEST_ADDRESS_NEVER_USE, TEST_PRIVATE_KEY } from '../data';
import BigNumber from 'bignumber.js';
import {
  fakeBlockByNumberResponse,
  fakeTransactionByHashResponse,
  fakeTransactionReceipt,
  latestBlock,
} from '../fake_tx_data';
import { SupportedChainId } from '../../../src/constants/chains';
import { decodeEthCall, encodeEthResult, keccak256 } from './abiutils';
import { Eip1193Bridge } from '@ethersproject/experimental';

function isTheSameAddress(address1: string, address2: string) {
  return address1.toLowerCase() === address2.toLowerCase();
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class CustomizedBridgeContext {
  chainId = formatChainId(String(SupportedChainId.RINKEBY));
  supportedChainIds: string[] = [];

  latestBlockNumber = 1;
  fakeTransactionIndex = 0;
  handlers: any = {};

  getLatestBlock() {
    this.latestBlockNumber++;
    return Object.assign(latestBlock, {
      number: this.latestBlockNumber,
    });
  }

  getFakeTransactionHash() {
    return keccak256([this.fakeTransactionIndex++]);
  }

  setHandler(address: string, { abi, handler }: { abi: any; handler: any }) {
    this.handlers[address] = { abi, handler };
  }
}

enum EventHandlerKey {
  CHAIN_CHANGED = 'chainChanged',
  ACCOUNTS_CHANGED = 'accountsChanged',
  CLOSE = 'close',
  NETWORK_CHANGED = 'networkChanged',
}

function enumKeys<O extends object, K extends keyof O = keyof O>(obj: O): K[] {
  return Object.keys(obj).filter((k) => Number.isNaN(+k)) as K[];
}

export class CustomizedBridge extends Eip1193Bridge {
  context = new CustomizedBridgeContext();

  eventListeners = {
    [EventHandlerKey.CHAIN_CHANGED]: function handleChainChanged(chainId: string | number) {},
    [EventHandlerKey.ACCOUNTS_CHANGED]: function handleAccountsChanged(accounts: string[]) {},
    [EventHandlerKey.CLOSE]: function handleClose(code: number, reason: string) {},
    [EventHandlerKey.NETWORK_CHANGED]: function handleNetworkChanged(networkId: string | number) {},
  };

  on(key: string, f: any) {
    for (const k of enumKeys(EventHandlerKey)) {
      if (key === EventHandlerKey[k]) {
        this.eventListeners[key] = f;
      }
    }
  }

  switchEthereumChainSpy(chainId: string) {}

  addEthereumChainSpy(chainId: string) {}

  setHandler(address: string, { abi, handler }: { abi: any; handler: any }) {
    this.context.setHandler(address, { abi, handler });
  }

  async sendAsync(...args: any[]) {
    console.debug('sendAsync called', ...args);
    return this.send(...args);
  }

  getSendArgs(args: any[]) {
    console.debug('send called', ...args);
    const isCallbackForm = typeof args[0] === 'object' && typeof args[1] === 'function';
    let callback;
    let method;
    let params;
    if (isCallbackForm) {
      callback = args[1];
      method = args[0].method;
      params = args[0].params;
    } else {
      method = args[0];
      params = args[1];
    }
    return {
      isCallbackForm,
      callback,
      method,
      params,
    };
  }

  async send(...args: any[]) {
    const { isCallbackForm, callback, method, params } = this.getSendArgs(args);
    let result = null;
    let resultIsSet = false;

    function setResult(r: any) {
      result = r;
      resultIsSet = true;
    }

    if (method === 'eth_requestAccounts' || method === 'eth_accounts') {
      setResult([TEST_ADDRESS_NEVER_USE]);
    }
    if (method === 'wallet_switchEthereumChain') {
      this.switchEthereumChainSpy(params[0].chainId);
      if (this.context.supportedChainIds.includes(params[0].chainId)) {
        this.context.chainId = params[0].chainId;
        this.eventListeners[EventHandlerKey.NETWORK_CHANGED](params[0].chainId);
        this.eventListeners[EventHandlerKey.CHAIN_CHANGED](params[0].chainId);
        setResult(null);
      } else {
        const chainId = params[0].chainId;
        const error = {
          code: 4902, // To-be-standardized "unrecognized chain ID" error
          message: `Unrecognized chain ID "${chainId}". Try adding the chain using wallet_addEthereumChain first.`,
        };
        if (isCallbackForm) {
          callback(error, null);
          return;
        } else {
          throw error;
        }
      }
    }
    if (method === 'wallet_addEthereumChain') {
      this.addEthereumChainSpy(params[0].chainId);
      this.context.supportedChainIds.push(params[0].chainId);
      setResult(null);
    }
    if (method === 'eth_chainId') {
      setResult(formatChainId(String(this.context.chainId)));
    }
    if (method === 'eth_estimateGas') {
      setResult('0xba7f');
    }
    if (method === 'eth_getBlockByNumber') {
      if (params[0] === 'latest') {
        setResult(this.context.getLatestBlock());
      } else {
        const [blockNumber, returnFullHashes] = params;
        setResult(
          Object.assign(fakeBlockByNumberResponse, {
            number: new BigNumber(blockNumber).toNumber(),
          }),
        );
      }
    }
    if (method === 'eth_getTransactionByHash') {
      const [transactionHash] = params;
      setResult(
        Object.assign(fakeTransactionByHashResponse, {
          hash: transactionHash,
        }),
      );
    }
    if (method === 'eth_getTransactionReceipt') {
      const [transactionHash] = params;
      const latestBlock = this.context.getLatestBlock();
      const resultLocal = Object.assign(fakeTransactionReceipt, {
        transactionHash,
        blockHash: latestBlock.hash,
        blockNumber: latestBlock.number,
        logs: fakeTransactionReceipt.logs.map((log) => Object.assign(log, transactionHash)),
      });
      setResult(resultLocal);
    }
    if (method === 'eth_blockNumber') {
      setResult(this.context.getLatestBlock().number);
    }
    if (method === 'eth_call') {
      for (const contractAddress in this.context.handlers) {
        if (isTheSameAddress(contractAddress, params[0].to)) {
          const { abi, handler } = this.context.handlers[contractAddress];
          const decoded = decodeEthCall(abi, params[0].data);
          if (handler[decoded.method]) {
            const res = await handler[decoded.method](this.context, decoded.inputs);
            setResult(encodeEthResult(abi, decoded.method, res));
          }
        }
      }
    }

    if (method === 'eth_sendTransaction') {
      for (const contractAddress in this.context.handlers) {
        if (isTheSameAddress(contractAddress, params[0].to)) {
          const { abi, handler } = this.context.handlers[contractAddress];
          const decoded = decodeEthCall(abi, params[0].data);
          if (handler[decoded.method]) {
            await handler[decoded.method](this.context, decoded.inputs);
            setResult(this.context.getFakeTransactionHash());
          }
        }
      }
    }

    if (resultIsSet) {
      if (isCallbackForm) {
        callback(null, { result });
        return;
      } else {
        return result;
      }
    }
    try {
      const result = await super.send(method, params);
      if (isCallbackForm) {
        callback(null, { result });
      } else {
        return result;
      }
    } catch (error) {
      console.log({ isCallbackForm, callback, method, params });

      if (isCallbackForm) {
        callback(error, null);
      } else {
        throw error;
      }
    }
  }
}

export const provider = new JsonRpcProvider('https://rinkeby.infura.io/v3/4bf032f2d38a4ed6bb975b80d6340847', 4);
export const signer = new Wallet(TEST_PRIVATE_KEY, provider);

export function getCustomizedBridge() {
  return new CustomizedBridge(signer, provider);
}
