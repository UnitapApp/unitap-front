import { TEST_ADDRESS_NEVER_USE, TEST_ADDRESS_NEVER_USE_SHORTENED } from '../support/commands';
import { chainList, chainListAuthenticatedClaimedFirst } from '../utils/data';

describe('Landing Page', () => {
  const setupGetChainListServerNotAuthenticated = () => {
    cy.route({
      method: 'GET',
      url: `/api/v1/chain/list/`,
      response: chainList,
    });
    cy.route({
      method: 'GET',
      url: `/api/v1/chain/list/${TEST_ADDRESS_NEVER_USE}`,
      response: chainList,
    });
  };

  const setupGetChainListAuthenticatedServer = () => {
    cy.route({
      method: 'GET',
      url: `/api/v1/chain/list/${TEST_ADDRESS_NEVER_USE}`,
      response: chainListAuthenticatedClaimedFirst,
    });
  };

  it('is connected', () => {
    cy.visit('/');
    cy.get('[data-cy=wallet-connect]').click();
    cy.get('[data-cy=wallet-connect]').contains(TEST_ADDRESS_NEVER_USE_SHORTENED);
  });

  it('loads chain list', () => {
    cy.server();
    setupGetChainListServerNotAuthenticated();
    cy.visit('/');
    cy.get(`[data-cy=chain-name-${chainList[0].pk}]`).contains(chainList[0].chainName);
    cy.get(`[data-cy=chain-claim-${chainList[1].pk}]`).contains('Claim ');
  });

  it('loads chain list authenticated', () => {
    cy.server();
    setupGetChainListAuthenticatedServer();
    cy.visit('/');
    cy.get(`[data-cy=chain-claim-${chainList[0].pk}]`).contains('Claimed');
    cy.get(`[data-cy=chain-claim-${chainList[1].pk}]`).contains('Claim ');
  });

  it('adds network', () => {
    cy.server();
    setupGetChainListAuthenticatedServer();
    cy.visit('/');
    cy.get(`[data-cy=chain-switch-${chainList[0].pk}]`).click();
    cy.get('[data-cy=wallet-chain-id]').contains(`Chain Id: ${chainList[0].chainId}`);
  });
});
