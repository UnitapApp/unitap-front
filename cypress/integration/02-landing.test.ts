import { CustomizedBridge, provider, signer } from '../support/commands';
import {
  chainList,
  chainListAuthenticatedClaimedFirst,
  TEST_ADDRESS_NEVER_USE,
  userProfileNotVerified,
  userProfileVerified,
} from '../utils/data';

describe('Landing Page', () => {
  beforeEach(() => {
    setupEthBridge();
    cy.server({ force404: true });
    setupGetUserProfileVerified();
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

  it('creates user if not exists', () => {
    setupGetChainListServerNotAuthenticated();

    setupGetUserProfileNotExists();

    cy.route({
      method: 'POST',
      url: `/api/v1/user/create/`,
      response: userProfileNotVerified,
    }).as('createUser');
    cy.visit('/');

    cy.wait('@createUser');
  });

  it('loads chain list', () => {
    setupGetChainListServerNotAuthenticated();
    cy.visit('/');
    cy.get(`[data-testid=chain-name-${chainList[0].pk}]`).contains(chainList[0].chainName);
    cy.get(`[data-testid=chain-show-claim-${chainList[1].pk}]`).contains('Claim ');
  });

  it('loads chain list authenticated', () => {
    setupGetChainListAuthenticated();
    cy.visit('/');
    cy.get(`[data-testid=chain-show-claim-${chainList[0].pk}]`).contains('Claimed');
    cy.get(`[data-testid=chain-show-claim-${chainList[1].pk}]`).contains('Claim ');
  });
});