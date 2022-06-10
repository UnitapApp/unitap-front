import {
  CustomizedBridge,
  provider,
  signer,
  SwitchChainBridge,
  SwitchToUnrecognizedChainBridge,
} from '../support/commands';
import {
  chainList,
  chainListAuthenticatedClaimedFirst,
  TEST_ADDRESS_NEVER_USE,
  TEST_ADDRESS_NEVER_USE_SHORTENED,
  userProfileVerified,
} from '../utils/data';
import { formatChainId } from '../../src/utils';
import RoutePath from '../../src/routes';

describe('Wallet', () => {
  beforeEach(() => {
    cy.on('window:before:load', (win) => {
      cy.spy(win.console, 'error').as('spyWinConsoleError');
      cy.spy(win.console, 'warn').as('spyWinConsoleWarn');
    });

    cy.server({ force404: true });
    setupGetChainListAuthenticated();
    setupGetUserProfileVerified();
  });

  afterEach(() => {
    cy.get('@spyWinConsoleError').should('have.callCount', 0);
    cy.get('@spyWinConsoleWarn').should('have.callCount', 0);
  });
  // @ts-ignore
  const setupEthBridge = () => {
    cy.on('window:before:load', (win) => {
      // @ts-ignore
      win.ethereum = new CustomizedBridge(signer, provider);
    });
  };

  const connectWallet = () => {
    cy.get('[data-testid=wallet-connect]').click();
  };

  const setupGetUserProfileVerified = () => {
    cy.route({
      method: 'GET',
      url: `/api/v1/user/${TEST_ADDRESS_NEVER_USE}/`,
      response: userProfileVerified,
    });
  };
  const setupGetChainListServerGeneral = () => {
    cy.route({
      method: 'GET',
      url: `/api/v1/chain/list/`,
      response: chainList,
    });
  };
  const setupGetChainListServerNotAuthenticated = () => {
    setupGetChainListServerGeneral();
    cy.route({
      method: 'GET',
      url: `/api/v1/chain/list/${TEST_ADDRESS_NEVER_USE}`,
      response: chainList,
    });
  };

  const setupGetChainListAuthenticated = () => {
    setupGetChainListServerGeneral();
    cy.route({
      method: 'GET',
      url: `/api/v1/chain/list/${TEST_ADDRESS_NEVER_USE}`,
      response: chainListAuthenticatedClaimedFirst,
    });
  };

  it('wallet is connected', () => {
    setupEthBridge();
    setupGetChainListServerNotAuthenticated();
    cy.visit(RoutePath.FAUCET);
    // cy.get('[data-testid=wallet-connect]').contains('Connect Wallet');
    connectWallet();
    cy.get('[data-testid=wallet-connect]').contains(TEST_ADDRESS_NEVER_USE_SHORTENED);
  });

  it('switches to network', () => {
    const ethBridge = new SwitchChainBridge(signer, provider);
    cy.on('window:before:load', (win) => {
      // @ts-ignore
      win.ethereum = ethBridge;
      // @ts-ignore
      cy.spy(win.ethereum, 'switchEthereumChainSpy');
    });

    setupGetChainListAuthenticated();
    cy.visit(RoutePath.FAUCET);
    connectWallet();
    cy.get(`[data-testid=chain-switch-${chainList[0].pk}]`).click();
    const expectedChainId = formatChainId(chainList[0].chainId);

    cy.window().then((win) => {
      // @ts-ignore
      expect(win.ethereum.switchEthereumChainSpy).to.have.calledWith(expectedChainId);
    });
  });

  it('adds network', () => {
    const ethBridge = new SwitchToUnrecognizedChainBridge(signer, provider);
    cy.on('window:before:load', (win) => {
      cy.spy(ethBridge, 'switchEthereumChainSpy');
      cy.spy(ethBridge, 'addEthereumChainSpy');
      // @ts-ignore
      win.ethereum = ethBridge;
    });

    setupGetChainListAuthenticated();
    cy.visit(RoutePath.FAUCET);
    connectWallet();
    cy.get(`[data-testid=chain-switch-${chainList[0].pk}]`).click();
    const expectedChainId = formatChainId(chainList[0].chainId);

    cy.window().then((win) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      expect(ethBridge.switchEthereumChainSpy).to.have.calledTwice;
      expect(ethBridge.switchEthereumChainSpy).to.have.calledWith(expectedChainId);
      expect(ethBridge.addEthereumChainSpy).to.have.calledWith(expectedChainId);
    });
  });
});
