import { CustomizedBridge, provider, signer } from '../support/commands';
import {
  chainList,
  chainListAuthenticatedClaimed,
  chainListAuthenticatedClaimedFirst,
  claimMaxResponse,
  emptyClaimHistoryResponse,
  getClaimHistoryRespondPending,
  getClaimHistoryRespondSuccessful,
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
    //cy.server({ force404: true });
    setupEthBridge();
    setupGetChainListAuthenticated();
  });

  afterEach(() => {
    cy.get('@spyWinConsoleError').should('have.callCount', 0);
    cy.get('@spyWinConsoleWarn').should('have.callCount', 0);
  });
  const setupGetChainListServerGeneral = () => {
    cy.intercept(
      {
        method: 'GET',
        url: `/api/v1/chain/list/`,
      },
      {
        body: chainList,
      },
    );
  };
  const setupGetChainListServerNotAuthenticated = () => {
    setupGetChainListServerGeneral();
    cy.intercept(
      {
        method: 'GET',
        url: `/api/v1/chain/list/${TEST_ADDRESS_NEVER_USE}`,
      },
      {
        body: chainList,
      },
    );
  };

  const setupGetChainListAuthenticated = () => {
    setupGetChainListServerGeneral();
    cy.intercept(
      {
        method: 'GET',
        url: `/api/v1/chain/list/${TEST_ADDRESS_NEVER_USE}`,
      },
      {
        body: chainListAuthenticatedClaimedFirst,
      },
    );
  };

  const setupGetChainListAuthenticatedClaimed = () => {
    setupGetChainListServerGeneral();
    cy.intercept(
      {
        method: 'GET',
        url: `/api/v1/chain/list/${TEST_ADDRESS_NEVER_USE}`,
      },
      {
        body: chainListAuthenticatedClaimed,
      },
    );
  };

  const setupGetChainListAuthenticatedClaimedDelaied = () => {
    setupGetChainListServerGeneral();
    cy.intercept(
      {
        method: 'GET',
        url: `/api/v1/chain/list/**`,
      },
      {
        body: chainListAuthenticatedClaimed,
        delay: 2000,
      },
    );
  };

  const setupGetUserProfileNotVerified = () => {
    cy.intercept(
      {
        method: 'GET',
        url: `/api/v1/user/${TEST_ADDRESS_NEVER_USE}/`,
      },
      {
        body: userProfileNotVerified,
      },
    );
    cy.intercept(
      {
        method: 'GET',
        url: `/api/v1/user/${TEST_ADDRESS_NEVER_USE}/claims?**`,
      },
      {
        body: emptyClaimHistoryResponse,
      },
    );
  };

  const setupGetUserProfileVerified = () => {
    cy.intercept(
      {
        method: 'GET',
        url: `/api/v1/user/${TEST_ADDRESS_NEVER_USE}/`,
      },
      {
        body: userProfileVerified,
      },
    );
    cy.intercept(
      {
        method: 'GET',
        url: `/api/v1/user/${TEST_ADDRESS_NEVER_USE}/claims?**`,
      },
      {
        body: emptyClaimHistoryResponse,
      },
    );
  };

  const setupClaimMax = () => {
    cy.intercept(
      {
        method: 'POST',
        url: `/api/v1/chain/${chainList[1].pk}/claim-max/${TEST_ADDRESS_NEVER_USE}`,
      },
      {
        delay: 2000,
        body: claimMaxResponse,
      },
    ).as('claimMax');
  };

  const setupClaimMaxError = () => {
    cy.intercept(
      {
        method: 'POST',
        url: `/api/v1/chain/${chainList[1].pk}/claim-max/${TEST_ADDRESS_NEVER_USE}`,
      },
      {
        status: 503,
        delay: 500,
        body: {},
      },
    ).as('claimMaxError');
  };
  // @ts-ignore
  const setupEthBridge = () => {
    cy.on('window:before:load', (win) => {
      // @ts-ignore
      win.ethereum = new CustomizedBridge(signer, provider);
    });
  };
  /*
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
  */
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
  /*
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
  */

  const setupPreClaimState = () => {
    cy.intercept(
      {
        method: 'POST',
        url: `/api/v1/chain/${chainList[1].pk}/claim-max/${TEST_ADDRESS_NEVER_USE}/`,
      },
      {
        body: claimMaxResponse,
        delay: 4000,
      },
    );
    cy.intercept(
      {
        method: 'GET',
        url: `/api/v1/user/${TEST_ADDRESS_NEVER_USE}/claims?**`,
      },
      {
        body: emptyClaimHistoryResponse,
      },
    );
  };
  const setupPendingClaimState = (chainId: number) => {
    cy.intercept(
      {
        method: 'POST',
        url: `/api/v1/chain/${chainList[1].pk}/claim-max/${TEST_ADDRESS_NEVER_USE}/`,

        // delay: 0,
      },
      { body: claimMaxResponse },
    );
    cy.intercept(
      {
        method: 'GET',
        url: `/api/v1/user/${TEST_ADDRESS_NEVER_USE}/claims?**`,
      },
      getClaimHistoryRespondPending(chainId),
    );
  };
  const setupSuccessClaimState = (chainId: number) => {
    cy.intercept(
      {
        method: 'GET',
        url: `/api/v1/user/${TEST_ADDRESS_NEVER_USE}/claims?**`,
      },
      {
        body: getClaimHistoryRespondSuccessful(chainId),
      },
    );
  };

  it('do claim', () => {
    setupGetChainListServerGeneral();
    setupGetUserProfileVerified();
    cy.visit(RoutePath.FAUCET);
    connectWallet();
    cy.wait(1000);

    cy.get(`[data-testid=chain-show-claim-${chainList[1].pk}]`).click();
    cy.get(`[data-testid=loading`).should('not.exist');
    cy.get(`[data-testid=chain-claim-modal-${chainList[1].pk}]`).should('exist');

    setupPreClaimState();
    cy.get(`[data-testid=chain-claim-action-${chainList[1].pk}]`).click();

    cy.wait(2000);
    cy.get(`[data-testid=request`).should('exist');

    cy.wait(2000);
    setupPendingClaimState(chainList[1].pk);

    cy.get(`[data-testid=pending]`).should('exist');

    cy.wait(2000);
    setupSuccessClaimState(chainList[1].pk);

    // cy.get(`[data-testid=claim-receipt]`).should('have.attr', 'href', getTxUrl(chainList[1], claimMaxResponse));
    cy.get(`[data-testid=chain-claim-success-${chainList[1].pk}]`).should('exist');

    cy.wait(2000);
    cy.get(`[data-testid=chain-claim-action-${chainList[1].pk}]`).click();
    cy.get(`[data-testid=chain-claim-modal-${chainList[1].pk}]`).should('not.exist');
  });
});
