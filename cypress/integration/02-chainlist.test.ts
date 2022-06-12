import { CustomizedBridge, provider, signer } from '../support/commands';
import {
  chainList,
  chainListAuthenticatedClaimedFirst,
  TEST_ADDRESS_NEVER_USE,
  userProfileNotVerified,
  userProfileVerified,
} from '../utils/data';
import RoutePath from '../../src/routes';
import { CYPRESS_FAST_INTERVAL } from '../../src/constants/intervals';

describe('Landing Page', () => {
  const connectWallet = () => {
    cy.get('[data-testid=wallet-connect]').click();
  };

  beforeEach(() => {
    cy.on('window:before:load', (win) => {
      cy.spy(win.console, 'error').as('spyWinConsoleError');
      cy.spy(win.console, 'warn').as('spyWinConsoleWarn');
    });
    setupEthBridge();
    cy.server({ force404: true });
    setupGetUserProfileVerified();
  });

  afterEach(() => {
    cy.get('@spyWinConsoleError').should('have.callCount', 0);
    cy.get('@spyWinConsoleWarn').should('have.callCount', 0);
  });
  const setupGetUserProfileVerified = () => {
    cy.route({
      method: 'GET',
      url: `/api/v1/user/${TEST_ADDRESS_NEVER_USE}/`,
      response: userProfileVerified,
    });
  };
  const setupEthBridge = () => {
    cy.on('window:before:load', (win) => {
      // @ts-ignore
      win.ethereum = new CustomizedBridge(signer, provider);
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
    }).as('chainListAuthenticated');
  };
  const setupGetUserProfileNotExists = () => {
    cy.route({
      method: 'GET',
      url: `/api/v1/user/${TEST_ADDRESS_NEVER_USE}/`,
      status: 404,
      response: {},
    });
  };

  it('creates user if not exists', () => {
    setupGetChainListServerNotAuthenticated();

    setupGetUserProfileNotExists();

    cy.route({
      method: 'POST',
      url: `/api/v1/user/create/`,
      response: userProfileNotVerified,
    }).as('createUser');
    cy.visit(RoutePath.FAUCET);
    connectWallet();
    cy.wait('@createUser');
  });

  it('loads chain list', () => {
    cy.route({
      method: 'GET',
      url: `/api/v1/chain/list/`,
      response: chainList,
      delay: CYPRESS_FAST_INTERVAL / 2,
    });
    cy.visit(RoutePath.FAUCET);
    cy.get(`[data-testid=chain-list-loading]`).should('exist');
    cy.get(`[data-testid=chain-list-loading]`).should('not.exist');
    cy.get(`[data-testid=chain-name-${chainList[0].pk}]`).contains(chainList[0].chainName);
    cy.get(`[data-testid=chain-show-claim-${chainList[1].pk}]`).should('exist');
  });

  it('loads chain list authenticated', () => {
    setupGetChainListAuthenticated();
    cy.visit(RoutePath.FAUCET);
    connectWallet();
    cy.get(`[data-testid=chain-claimed-${chainList[0].pk}]`).should('exist');
    cy.get(`[data-testid=chain-show-claim-${chainList[1].pk}]`).should('exist');
    cy.wait(CYPRESS_FAST_INTERVAL);
    // @ts-ignore
    cy.shouldBeCalled('chainListAuthenticated', 2);
  });
});
