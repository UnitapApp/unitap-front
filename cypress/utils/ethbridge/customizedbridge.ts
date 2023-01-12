// ***********************************************
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

import { JsonRpcProvider } from '@ethersproject/providers';
import { Wallet } from '@ethersproject/wallet';
import { formatChainId } from '../../../src/utils';

import { SAMPLE_ERROR_MESSAGE, TEST_ADDRESS_NEVER_USE, TEST_PRIVATE_KEY } from '../data';
import BigNumber from 'bignumber.js';
import {
  fakeBlockByNumberResponse,
  fakeTransactionByHashResponse,
  fakeTransactionReceipt,
  latestBlock,
} from '../fake_tx_data';
import { SupportedChainId } from '../../../src/constants/chains';
import { keccak256 } from './abiutils';
import { Eip1193Bridge } from '@ethersproject/experimental';
import { GENERIC_ERROR_CODE, GENERIC_ERROR_CODE_2, USER_DENIED_REQUEST_ERROR_CODE } from '../../../src/utils/web3';

function isTheSameAddress(address1: string, address2: string) {
  return address1.toLowerCase() === address2.toLowerCase();
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class CustomizedBridgeContext {
  chainId = formatChainId(String(SupportedChainId.GOERLI));
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

export enum EventHandlerKey {
  CHAIN_CHANGED = 'chainChanged',
  ACCOUNTS_CHANGED = 'accountsChanged',
  CLOSE = 'close',
  NETWORK_CHANGED = 'networkChanged',
}

export enum TransactionStatus {
  SUCCESS = 'success',
  INSUFFICIENT_FUND = 'insufficientFund',
  USER_DENIED = 'rejected',
  FAILED = 'failed',
}

const insufficientFundTransactionError = {
  code: GENERIC_ERROR_CODE_2,
  message: `err: insufficient funds for gas * price + value: address ${TEST_ADDRESS_NEVER_USE} have 2000 want 10000000000000000000000000 (supplied gas 14995852)`,
};
const insufficientFundGasEstimateError = {
  code: GENERIC_ERROR_CODE,
  message: 'Internal JSON-RPC error.',
  data: {
    code: GENERIC_ERROR_CODE_2,
    message: `insufficient funds for transfer: address ${TEST_ADDRESS_NEVER_USE}`,
  },
};
const userDeniedTransactionError = {
  code: USER_DENIED_REQUEST_ERROR_CODE,
  message: 'MetaMask Tx Signature: User denied transaction signature.',
  stack:
    '{\n  "code": 4001,\n  "message": "MetaMask Tx Signature: User denied transaction signature.",\n  "stack": "Error: MetaMask Tx Signature: User denied transaction signature.\\n...',
};

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

  transactionStatus = TransactionStatus.SUCCESS;
  transactionWaitTime = 0;

  setTransactionStatus(status: TransactionStatus) {
    this.transactionStatus = status;
  }

  setTransactionWaitTime(waitTime: number) {
    this.transactionWaitTime = waitTime;
  }

  on(key: string, f: any) {
    let found = false;
    for (const k of enumKeys(EventHandlerKey)) {
      if (key === EventHandlerKey[k]) {
        found = true;
        this.eventListeners[key] = f;
        break;
      }
    }
    if (!found) {
      console.error(`Bridge: Unknown Event Key ${key}`);
      throw Error(`Bridge: Unknown Event Key ${key}`);
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
    let runError = null;
    let errorIsSet = false;

    function setResult(r: any) {
      result = r;
      resultIsSet = true;
    }

    function setError(e: any) {
      runError = e;
      errorIsSet = true;
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
        setError(error);
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
      // for (const contractAddress in this.context.handlers) {
      //   if (isTheSameAddress(contractAddress, params[0].to)) {
      //     const { abi, handler } = this.context.handlers[contractAddress];
      //     const decoded = decodeEthCall(abi, params[0].data);
      //     if (handler[decoded.method]) {
      //       const res = await handler[decoded.method](this.context, decoded.inputs);
      //       setResult(encodeEthResult(abi, decoded.method, res));
      //     }
      //   }
      // }
    }
    if (method === 'eth_estimateGas') {
      if (this.transactionStatus === TransactionStatus.INSUFFICIENT_FUND) {
        setError(insufficientFundGasEstimateError);
      } else {
        setResult('0xba7f');
      }
    }
    if (method === 'eth_sendTransaction') {
      // for (const contractAddress in this.context.handlers) {
      //   if (isTheSameAddress(contractAddress, params[0].to)) {
      //     const { abi, handler } = this.context.handlers[contractAddress];
      //     const decoded = decodeEthCall(abi, params[0].data);
      //     if (handler[decoded.method]) {
      //       await handler[decoded.method](this.context, decoded.inputs);
      //       setResult(this.context.getFakeTransactionHash());
      //     }
      //   }
      // }
      if (this.transactionStatus === TransactionStatus.SUCCESS) {
        setResult(this.context.getFakeTransactionHash());
      } else if (this.transactionStatus === TransactionStatus.USER_DENIED) {
        setError(userDeniedTransactionError);
      } else if (this.transactionStatus === TransactionStatus.INSUFFICIENT_FUND) {
        setError(insufficientFundTransactionError);
      } else {
        setError({ error: { message: SAMPLE_ERROR_MESSAGE } });
      }
      if (this.transactionWaitTime) {
        await sleep(this.transactionWaitTime);
      }
    }

    if (errorIsSet) {
      if (isCallbackForm) {
        callback(runError, null);
      } else {
        throw runError;
      }
    } else if (resultIsSet) {
      if (isCallbackForm) {
        callback(null, { result });
      } else {
        return result;
      }
    } else {
      try {
        const result = await super.send(method, params);
        if (isCallbackForm) {
          callback(null, { result });
        } else {
          return result;
        }
      } catch (error) {
        if (isCallbackForm) {
          callback(error, null);
        } else {
          throw error;
        }
      }
    }
  }
}

export const provider = new JsonRpcProvider('https://goerli.infura.io/v3/4bf032f2d38a4ed6bb975b80d6340847', 4);
export const signer = new Wallet(TEST_PRIVATE_KEY, provider);

export function getCustomizedBridge() {
  return new CustomizedBridge(signer, provider);
}
