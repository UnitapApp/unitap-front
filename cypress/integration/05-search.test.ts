import {
  chainList,
  chainListAuthenticatedClaimedFirst,
  emptyClaimHistoryResponse,
  TEST_ADDRESS_NEVER_USE,
  userProfileVerified,
} from '../utils/data';
import RoutePath from '../../src/routes';
import { getCustomizedBridge } from '../utils/ethbridge/customizedbridge';

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
    cy.route({
      method: 'GET',
      url: `/api/v1/user/${TEST_ADDRESS_NEVER_USE}/claims?**`,
      response: emptyClaimHistoryResponse,
    });
  };
  const setupEthBridge = () => {
    cy.on('window:before:load', (win) => {
      // @ts-ignore
      win.ethereum = getCustomizedBridge();
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
  const setupGetUserProfileNotExists = () => {
    cy.route({
      method: 'GET',
      url: `/api/v1/user/${TEST_ADDRESS_NEVER_USE}/`,
      status: 404,
      response: {},
    });
  };

  it(`search dai and show xdai not show eidi`, () => {
    setupGetChainListServerNotAuthenticated();
    cy.visit(RoutePath.FAUCET);
    connectWallet();
    cy.get('[data-testid=search-box]').type('dai');
    cy.get(`[data-testid=chain-name-${chainList[0].pk}]`).should('exist');

    cy.get(`[data-testid=chain-name-${chainList[1].pk}]`).should('not.exist');
  });

  it(`search eid and show eidi not show xdai`, () => {
    setupGetChainListServerNotAuthenticated();
    cy.visit(RoutePath.FAUCET);
    connectWallet();
    cy.get('[data-testid=search-box]').type('eid');
    cy.get(`[data-testid=chain-name-${chainList[1].pk}]`).should('exist');

    cy.get(`[data-testid=chain-name-${chainList[0].pk}]`).should('not.exist');
  });

  it(`search idc and show eidi not show xdai`, () => {
    setupGetChainListServerNotAuthenticated();
    cy.visit(RoutePath.FAUCET);
    connectWallet();
    cy.get('[data-testid=search-box]').type('idc');
    cy.get(`[data-testid=chain-name-${chainList[1].pk}]`).should('exist');

    cy.get(`[data-testid=chain-name-${chainList[0].pk}]`).should('not.exist');
  });
});
