// ***********************************************
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

import { Eip1193Bridge } from '@ethersproject/experimental/lib/eip1193-bridge';
import { JsonRpcProvider } from '@ethersproject/providers';
import { TEST_ADDRESS_NEVER_USE, TEST_PRIVATE_KEY } from '../utils/data';
import { Wallet } from '@ethersproject/wallet';
import { BrowserMultiFormatReader } from '@zxing/browser';

const reader = new BrowserMultiFormatReader();

export class CustomizedBridge extends Eip1193Bridge {
  chainId = 4;

  async sendAsync(...args) {
    console.debug('sendAsync called', ...args);
    return this.send(...args);
  }

  getSendArgs(args) {
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

  async send(...args) {
    const { isCallbackForm, callback, method, params } = this.getSendArgs(args);
    if (method === 'eth_requestAccounts' || method === 'eth_accounts') {
      if (isCallbackForm) {
        callback({ result: [TEST_ADDRESS_NEVER_USE] });
      } else {
        return Promise.resolve([TEST_ADDRESS_NEVER_USE]);
      }
    }
    if (method === 'eth_chainId') {
      if (isCallbackForm) {
        callback(null, { result: '0x4' });
      } else {
        return Promise.resolve('0x4');
      }
    }
    try {
      const result = await super.send(method, params);
      console.debug('result received', method, params, result);
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

export class SwitchChainBridge extends CustomizedBridge {
  switchEthereumChainSpy(chainId) {}

  async send(...args) {
    const { isCallbackForm, callback, method, params } = this.getSendArgs(args);
    if (method === 'wallet_switchEthereumChain') {
      this.switchEthereumChainSpy(params[0].chainId);
      if (isCallbackForm) {
        callback(null, { result: null });
      } else {
        return null;
      }
    }
    return super.send(...args);
  }
}

export class SwitchToUnrecognizedChainBridge extends CustomizedBridge {
  switchEthereumChainSpy(chainId) {}

  addEthereumChainSpy(chainId) {}

  async send(...args) {
    const { isCallbackForm, callback, method, params } = this.getSendArgs(args);
    if (method === 'wallet_switchEthereumChain') {
      this.switchEthereumChainSpy(params[0].chainId);
      const chainId = params[0].chainId;
      const error = {
        code: 4902, // To-be-standardized "unrecognized chain ID" error
        message: `Unrecognized chain ID "${chainId}". Try adding the chain using wallet_addEthereumChain first.`,
      };
      if (isCallbackForm) {
        callback(error, null);
      } else {
        throw error;
      }
    }
    if (method === 'wallet_addEthereumChain') {
      this.addEthereumChainSpy(params[0].chainId);
      if (isCallbackForm) {
        callback(null, { result: null });
      } else {
        return null;
      }
    }
    return super.send(...args);
  }
}

export const provider = new JsonRpcProvider('https://rinkeby.infura.io/v3/4bf032f2d38a4ed6bb975b80d6340847', 4);
export const signer = new Wallet(TEST_PRIVATE_KEY, provider);

Cypress.Commands.add('shouldBeCalled', (alias, timesCalled) => {
  expect(
    cy.state('requests').filter((call) => call.alias === alias),
    `${alias} should have been called ${timesCalled} times`,
  ).to.have.length(timesCalled);
});

// https://github.com/cypress-io/cypress/issues/2752#issuecomment-1039285381
Cypress.on('window:before:load', (win) => {
  let copyText;

  if (!win.navigator.clipboard) {
    win.navigator.clipboard = {
      __proto__: {},
    };
  }

  win.navigator.clipboard.__proto__.writeText = (text) => (copyText = text);
  win.navigator.clipboard.__proto__.readText = () => copyText;
});

// https://medium.com/cypress-io-thailand/qr-code-barcode-testing-with-cypress-d738f496068b
Cypress.Commands.add('readQRCode', { prevSubject: true }, (subject) => {
  const img = subject[0];
  const image = new Image();
  image.width = img.width;
  image.height = img.height;
  image.src = img.src;
  image.crossOrigin = 'Anonymous';
  return reader.decodeFromImageElement(image);
});
