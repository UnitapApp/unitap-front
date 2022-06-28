import {
  chainList,
  chainListAuthenticatedClaimed,
  chainListAuthenticatedClaimedFirst,
  claimMaxResponse,
  emptyClaimHistoryResponse,
  getClaimHistoryRespondFailed,
  getClaimHistoryRespondPending,
  getClaimHistoryRespondPendingAfterFail,
  getClaimHistoryRespondSuccessful,
  getClaimHistoryRespondSuccessfullAfterFail,
  TEST_ADDRESS_NEVER_USE,
  userProfileNotVerified,
  userProfileVerified,
} from '../utils/data';
import RoutePath from '../../src/routes';
import { getCustomizedBridge } from '../utils/ethbridge/customizedbridge';
import { CYPRESS_FAST_INTERVAL } from '../../src/constants/intervals';

describe('Claim', () => {
  const chainPk = chainList[1].pk;
  const connectWallet = () => {
    cy.get('[data-testid=wallet-connect]').click();
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

  beforeEach(() => {
    cy.on('window:before:load', (win) => {
      cy.spy(win.console, 'error').as('spyWinConsoleError');
      cy.spy(win.console, 'warn').as('spyWinConsoleWarn');
    });
    cy.intercept(
      {
        url: `**/api/**`,
      },
      {
        statusCode: 404,
      },
    );
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
        delay: CYPRESS_FAST_INTERVAL,
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
        url: `/api/v1/chain/${chainPk}/claim-max/${TEST_ADDRESS_NEVER_USE}`,
      },
      {
        delay: CYPRESS_FAST_INTERVAL,
        body: claimMaxResponse,
      },
    ).as('claimMax');
  };

  const setupClaimMaxError = () => {
    cy.intercept(
      {
        method: 'POST',
        url: `/api/v1/chain/${chainPk}/claim-max/${TEST_ADDRESS_NEVER_USE}`,
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
      win.ethereum = getCustomizedBridge();
    });
  };

  /*
  it('cannot claim with unverified BrightID', () => {
    setupGetUserProfileNotVerified();
    setupClaimMax();
    cy.visit(RoutePath.FAUCET);
    connectWallet();
    cy.wait(1000);

    cy.get(`[data-testid=chain-show-claim-${chainPk}]`).click();
    cy.get(`[data-testid=chain-claim-modal-${chainPk}]`).should('exist');
    cy.get(`[data-testid=chain-claim-action-${chainPk}]`).click();
    // @ts-ignore
    cy.shouldBeCalled('claimMax', 0);
  });
  */
  function claimSuccess() {
    cy.get(`[data-testid=chain-claim-modal-${chainPk}]`).should('exist');
    setupClaimMax();
    setupGetChainListAuthenticatedClaimed();
    cy.get(`[data-testid=chain-claim-action-${chainPk}]`).click();
    cy.get(`[data-testid=chain-claim-action-${chainPk}]`).click();
    cy.get(`[data-testid=chain-claim-action-${chainPk}]`).click();
    cy.get(`[data-testid=loading`).should('exist');
    // @ts-ignore
    cy.shouldBeCalled('claimMax', 1);

    // cy.get(`[data-testid=claim-receipt]`).should('have.attr', 'href', getTxUrl(chainList[1], claimMaxResponse));
    cy.get(`[data-testid=chain-claim-success-${chainPk}]`).should('exist');
    cy.get(`[data-testid=chain-claim-action-${chainPk}]`).click();
    cy.get(`[data-testid=chain-claim-modal-${chainPk}]`).should('not.exist');
  }

  const setupPreClaimState = () => {
    cy.intercept(
      {
        method: 'POST',
        url: `/api/v1/chain/${chainPk}/claim-max/${TEST_ADDRESS_NEVER_USE}/`,
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
  const setupPendingClaimState = () => {
    cy.intercept(
      {
        method: 'GET',
        url: `/api/v1/user/${TEST_ADDRESS_NEVER_USE}/claims?**`,
      },
      getClaimHistoryRespondPending(chainPk),
    );
  };
  const setupSuccessClaimState = () => {
    cy.intercept(
      {
        method: 'GET',
        url: `/api/v1/user/${TEST_ADDRESS_NEVER_USE}/claims?**`,
      },
      {
        body: getClaimHistoryRespondSuccessful(chainPk),
      },
    );
  };

  const setupPreReclaimState = () => {
    cy.intercept(
      {
        method: 'POST',
        url: `/api/v1/chain/${chainPk}/claim-max/${TEST_ADDRESS_NEVER_USE}/`,
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
        body: getClaimHistoryRespondFailed(chainPk),
      },
    );
  };
  const setupPendingReclaimState = () => {
    cy.intercept(
      {
        method: 'GET',
        url: `/api/v1/user/${TEST_ADDRESS_NEVER_USE}/claims?**`,
      },
      getClaimHistoryRespondPendingAfterFail(chainPk),
    );
  };
  const setupSuccessReclaimState = () => {
    cy.intercept(
      {
        method: 'GET',
        url: `/api/v1/user/${TEST_ADDRESS_NEVER_USE}/claims?**`,
      },
      {
        body: getClaimHistoryRespondSuccessfullAfterFail(chainPk),
      },
    );
  };

  function claimSubmitSuccessState() {
    setupPreClaimState();
    cy.get(`[data-testid=chain-claim-initial-${chainPk}`).should('exist');
    cy.get(`[data-testid=chain-claim-action-${chainPk}]`).click();

    cy.get(`[data-testid=chain-claim-request-${chainPk}`).should('exist');
  }

  function claimPendingState(checkStatePersistence: boolean) {
    setupPendingClaimState();
    cy.get(`[data-testid=chain-claim-pending-${chainPk}]`).should('exist');

    if (checkStatePersistence) {
      cy.get(`[data-testid=close-modal`).click();
      cy.get(`[data-testid=chain-show-claim-${chainPk}]`).click();
      cy.get(`[data-testid=chain-claim-pending-${chainPk}]`).should('exist');
    }
  }

  function claimSuccessState(checkStatePersistence: boolean) {
    setupSuccessClaimState();
    // cy.get(`[data-testid=claim-receipt]`).should('have.attr', 'href', getTxUrl(chainList[1], claimMaxResponse));
    cy.get(`[data-testid=chain-claim-success-${chainPk}]`).should('exist');

    if (checkStatePersistence) {
      cy.get(`[data-testid=close-modal]`).click();
      cy.get(`[data-testid=chain-show-claim-${chainPk}]`).click();
      cy.get(`[data-testid=chain-claim-success-${chainPk}]`).should('exist');
    }
  }

  it('do claim (state persists after closing the modal)', () => {
    setupGetUserProfileVerified();
    cy.visit(RoutePath.FAUCET);
    connectWallet();

    cy.get(`[data-testid=chain-show-claim-${chainPk}]`).click();
    cy.get(`[data-testid=chain-claim-modal-${chainPk}]`).should('exist');

    claimSubmitSuccessState();
    claimPendingState(true);
    claimSuccessState(true);
  });

  it('do claim after fail', () => {
    setupGetUserProfileVerified();
    cy.visit(RoutePath.FAUCET);
    connectWallet();
    cy.wait(1000);

    setupPreReclaimState();
    cy.get(`[data-testid=chain-show-claim-${chainPk}]`).click();
    cy.get(`[data-testid=chain-claim-failed-${chainPk}`).should('exist');

    cy.get(`[data-testid=chain-claim-action-${chainPk}]`).click();

    cy.get(`[data-testid=chain-claim-initial-${chainPk}`).should('exist');
    cy.get(`[data-testid=chain-claim-action-${chainPk}]`).click();

    cy.get(`[data-testid=chain-claim-request-${chainPk}`).should('exist');

    setupPendingReclaimState();

    cy.get(`[data-testid=chain-claim-pending-${chainPk}]`).should('exist');

    setupSuccessReclaimState();

    // cy.get(`[data-testid=claim-receipt]`).should('have.attr', 'href', getTxUrl(chainList[1], claimMaxResponse));
    cy.get(`[data-testid=chain-claim-success-${chainPk}]`).should('exist');

    cy.get(`[data-testid=close-modal]`).click();
    cy.get(`[data-testid=chain-claim-modal-${chainPk}]`).should('not.exist');
  });

  it('do claim connect brightid and wallet via claim modal', () => {
    setupGetUserProfileNotVerified();
    cy.visit(RoutePath.FAUCET);

    cy.get(`[data-testid=chain-show-claim-${chainPk}]`).click();
    cy.get(`[data-testid=chain-claim-modal-${chainPk}]`).should('exist');

    cy.get('[data-testid=chain-claim-wallet-not-connected]').should('exist');
    cy.get(`[data-testid=chain-claim-action-${chainPk}]`).click();

    cy.get('[data-testid=chain-claim-brightid-not-connected]').should('exist');
    cy.get(`[data-testid=chain-claim-action-${chainPk}]`).click();

    cy.get(`[data-testid=chain-claim-modal-${chainPk}]`).should('not.exist');
    cy.get(`[data-testid=brightid-modal]`).should('exist');

    cy.get(`[data-testid=bright-id-connection-refresh-button]`).click();
    setupGetUserProfileVerified();
    cy.get(`[data-testid=bright-id-connection-refresh-button-try-again]`).click();

    claimSubmitSuccessState();
    claimPendingState(false);
    claimSuccessState(false);
  });
});
