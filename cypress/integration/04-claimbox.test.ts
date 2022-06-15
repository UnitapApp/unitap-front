import { CustomizedBridge, provider, signer } from '../support/commands';
import {
  chainList,
  chainListAuthenticatedClaimed,
  chainListAuthenticatedClaimedFirst,
  claimMaxResponse,
  emptyClaimHistoryResponse,
  TEST_ADDRESS_NEVER_USE,
  userProfileNotVerified,
  userProfileVerified,
} from '../utils/data';
import RoutePath from '../../src/routes';

describe('Claim', () => {
  const connectWallet = () => {
    cy.get('[data-testid=wallet-connect]').click();
  };

  beforeEach(() => {
    cy.on('window:before:load', (win) => {
      cy.spy(win.console, 'error').as('spyWinConsoleError');
      cy.spy(win.console, 'warn').as('spyWinConsoleWarn');
    });

    cy.server({ force404: true });
    setupEthBridge();
    setupGetChainListAuthenticated();
  });

  afterEach(() => {
    cy.get('@spyWinConsoleError').should('have.callCount', 0);
    cy.get('@spyWinConsoleWarn').should('have.callCount', 0);
  });
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

  const setupGetChainListAuthenticatedClaimed = () => {
    setupGetChainListServerGeneral();
    cy.route({
      method: 'GET',
      url: `/api/v1/chain/list/${TEST_ADDRESS_NEVER_USE}`,
      response: chainListAuthenticatedClaimed,
    });
  };

  const setupGetChainListAuthenticatedClaimedDelaied = () => {
    setupGetChainListServerGeneral();
    cy.route({
      method: 'GET',
      url: `/api/v1/chain/list/${TEST_ADDRESS_NEVER_USE}`,
      response: chainListAuthenticatedClaimed,
      delay: 5000,
    });
  };

  const setupGetUserProfileNotVerified = () => {
    cy.route({
      method: 'GET',
      url: `/api/v1/user/${TEST_ADDRESS_NEVER_USE}/`,
      response: userProfileNotVerified,
    });
    cy.route({
      method: 'GET',
      url: `/api/v1/user/${TEST_ADDRESS_NEVER_USE}/claims?**`,
      response: emptyClaimHistoryResponse,
    });
  };

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

  const setupClaimMax = () => {
    cy.route({
      method: 'POST',
      url: `/api/v1/chain/${chainList[1].pk}/claim-max/${TEST_ADDRESS_NEVER_USE}`,
      response: claimMaxResponse,
      delay: 500,
    }).as('claimMax');
  };

  const setupClaimMaxError = () => {
    cy.route({
      method: 'POST',
      url: `/api/v1/chain/${chainList[1].pk}/claim-max/${TEST_ADDRESS_NEVER_USE}`,
      status: 503,
      response: {},
      delay: 500,
    }).as('claimMaxError');
  };
  // @ts-ignore
  const setupEthBridge = () => {
    cy.on('window:before:load', (win) => {
      // @ts-ignore
      win.ethereum = new CustomizedBridge(signer, provider);
    });
  };

  it('cannot claim with unverified BrightID', () => {
    setupGetUserProfileNotVerified();
    setupClaimMax();
    cy.visit(RoutePath.FAUCET);
    connectWallet();
    cy.wait(1000);

    cy.get(`[data-testid=chain-show-claim-${chainList[1].pk}]`).click();
    cy.get(`[data-testid=chain-claim-modal-${chainList[1].pk}]`).should('exist');
    cy.get(`[data-testid=chain-claim-action-${chainList[1].pk}]`).click();
    // @ts-ignore
    cy.shouldBeCalled('claimMax', 0);
  });

  function claimSuccess() {
    cy.get(`[data-testid=chain-claim-modal-${chainList[1].pk}]`).should('exist');
    setupClaimMax();
    setupGetChainListAuthenticatedClaimed();
    cy.get(`[data-testid=chain-claim-action-${chainList[1].pk}]`).click();
    cy.get(`[data-testid=chain-claim-action-${chainList[1].pk}]`).click();
    cy.get(`[data-testid=chain-claim-action-${chainList[1].pk}]`).click();
    cy.get(`[data-testid=loading`).should('exist');
    // @ts-ignore
    cy.shouldBeCalled('claimMax', 1);

    // cy.get(`[data-testid=claim-receipt]`).should('have.attr', 'href', getTxUrl(chainList[1], claimMaxResponse));
    cy.get(`[data-testid=chain-claim-success-${chainList[1].pk}]`).should('exist');
    cy.get(`[data-testid=chain-claim-action-${chainList[1].pk}]`).click();
    cy.get(`[data-testid=chain-claim-modal-${chainList[1].pk}]`).should('not.exist');
  }

  it('do claim', () => {
    setupGetUserProfileVerified();
    cy.visit(RoutePath.FAUCET);
    connectWallet();
    cy.wait(1000);

    cy.get(`[data-testid=chain-show-claim-${chainList[1].pk}]`).click();
    cy.get(`[data-testid=loading`).should('not.exist');

    claimSuccess();
  });

  it('claim error and retry to succeed', () => {
    setupGetUserProfileVerified();
    setupClaimMaxError();
    cy.visit(RoutePath.FAUCET);
    connectWallet();
    cy.wait(1000);

    cy.get(`[data-testid=chain-show-claim-${chainList[1].pk}]`).click();
    cy.get(`[data-testid=loading`).should('not.exist');

    cy.get(`[data-testid=chain-claim-modal-${chainList[1].pk}]`).should('exist');

    setupGetChainListAuthenticatedClaimed();
    cy.get(`[data-testid=chain-claim-action-${chainList[1].pk}]`).click();
    cy.get(`[data-testid=chain-claim-action-${chainList[1].pk}]`).click();
    cy.get(`[data-testid=chain-claim-action-${chainList[1].pk}]`).click();
    cy.get(`[data-testid=loading`).should('exist');
    // @ts-ignore
    cy.shouldBeCalled('claimMaxError', 1);

    // cy.get(`[data-testid=claim-receipt]`).should('have.attr', 'href', getTxUrl(chainList[1], claimMaxResponse));
    cy.get(`[data-testid=chain-claim-failed-${chainList[1].pk}]`).should('exist');
    claimSuccess();
  });

  function closeAndOpenClaimModal(chainIndex: number) {
    cy.get(`[data-testid=chain-claim-modal-${chainList[chainIndex].pk}]`).should('exist');
    cy.get(`[data-testid=close-modal]`).should('exist').click();
    cy.get(`[data-testid=chain-claim-modal-${chainList[chainIndex].pk}]`).should('not.exist');

    cy.get(`[data-testid=chain-show-claim-${chainList[chainIndex].pk}]`).should('exist').click();
    cy.get(`[data-testid=chain-claim-modal-${chainList[chainIndex].pk}]`).should('exist');
  }

  it('close button closes the modal and it can get opened again', () => {
    setupGetUserProfileVerified();
    setupClaimMax();
    cy.visit(RoutePath.FAUCET);
    connectWallet();
    cy.wait(1000);

    cy.get(`[data-testid=chain-show-claim-${chainList[1].pk}]`).click();
    cy.get(`[data-testid=loading`).should('not.exist');

    cy.get(`[data-testid=chain-claim-modal-${chainList[1].pk}]`).should('exist');
    closeAndOpenClaimModal(1);
  });

  it('error if multiple claim api calls are called concurrent by reopening claim modal', () => {
    setupGetUserProfileVerified();
    setupClaimMax();
    cy.visit(RoutePath.FAUCET);
    connectWallet();
    cy.wait(1000);

    cy.get(`[data-testid=chain-show-claim-${chainList[1].pk}]`).click();
    cy.get(`[data-testid=loading`).should('not.exist');

    cy.get(`[data-testid=chain-claim-modal-${chainList[1].pk}]`).should('exist');

    setupGetChainListAuthenticatedClaimedDelaied();
    cy.get(`[data-testid=chain-claim-action-${chainList[1].pk}]`).click();
    cy.get(`[data-testid=loading`).should('exist');
    closeAndOpenClaimModal(1);
    cy.get(`[data-testid=loading`).should('exist');

    cy.wait(5000);

    // cy.get(`[data-testid=claim-receipt]`).should('have.attr', 'href', getTxUrl(chainList[1], claimMaxResponse));
    cy.get(`[data-testid=chain-claim-success-${chainList[1].pk}]`).should('exist');
    cy.get(`[data-testid=chain-claim-action-${chainList[1].pk}]`).click();
    cy.get(`[data-testid=chain-claim-modal-${chainList[1].pk}]`).should('not.exist');
  });
});
