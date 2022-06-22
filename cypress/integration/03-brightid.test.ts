import {
  chainList,
  chainListAuthenticatedClaimedFirst,
  TEST_ADDRESS_NEVER_USE,
  userProfileNotVerified,
  userProfileVerified,
} from '../utils/data';
import { getVerificationQr } from '../../src/utils';
import RoutePath from '../../src/routes';
import { getCustomizedBridge } from '../utils/ethbridge/customizedbridge';

describe('BrightID', () => {
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
  const setupGetChainListAuthenticated = () => {
    setupGetChainListServerGeneral();
    cy.route({
      method: 'GET',
      url: `/api/v1/chain/list/${TEST_ADDRESS_NEVER_USE}`,
      response: chainListAuthenticatedClaimedFirst,
    });
  };

  const setupGetUserProfileNotVerified = () => {
    cy.route({
      method: 'GET',
      url: `/api/v1/user/${TEST_ADDRESS_NEVER_USE}/`,
      response: userProfileNotVerified,
    }).as('getUserProfile');
  };

  const setupGetUserProfileVerified = () => {
    cy.route({
      method: 'GET',
      url: `/api/v1/user/${TEST_ADDRESS_NEVER_USE}/`,
      response: userProfileVerified,
    }).as('getUserProfileVerified');
  };

  it('does not show BrightID linking when verified', () => {
    setupGetUserProfileVerified();
    cy.visit(RoutePath.FAUCET);
    connectWallet();
    cy.get(`[data-testid=brightid-connected]`).click();
    cy.get(`[data-testid=brightid-modal]`).should('not.exist');
  });

  function openBrightIdModal() {
    setupGetUserProfileNotVerified();
    cy.visit(RoutePath.FAUCET);
    connectWallet();
    cy.get(`[data-testid=brightid-show-modal]`).contains('Connect').click();
    cy.get(`[data-testid=brightid-modal]`).should('exist');
  }

  it('closes modal on click outside', () => {
    openBrightIdModal();
    cy.get(`[data-testid=brightid-modal]`).should('exist');
    cy.get(`[data-testid=modal-content]`).click();
    cy.get(`[data-testid=brightid-modal]`).should('exist');
    cy.get(`[data-testid=modal-wrapper]`).click('left');
    cy.get(`[data-testid=brightid-modal]`).should('not.exist');
  });

  it('copies BrightID linking url when not verified', () => {
    Cypress.on('window:before:load', (win) => {
      cy.spy(win.navigator.clipboard, 'writeText');
    });
    openBrightIdModal();
    cy.get(`[data-testid=brightid-copy-link]`).click();

    cy.window().then((win) => {
      expect(win.navigator.clipboard.writeText).to.have.calledWith(userProfileVerified.verificationUrl);
    });
  });

  it('shows linking qr and url when not verified', () => {
    openBrightIdModal();
    const qrText = getVerificationQr(userProfileVerified);
    // @ts-ignore
    cy.get(`[data-testid=brightid-qr]`).readQRCode().should('have.property', 'text', qrText);
  });

  it('refresh BrightID connection button', () => {
    openBrightIdModal();

    cy.get(`[data-testid=bright-id-connection-refresh-button]`).click();
    // @ts-ignore
    cy.shouldBeCalled('getUserProfile', 2);

    cy.wait(200);
    setupGetUserProfileVerified();
    cy.get(`[data-testid=bright-id-connection-refresh-button-try-again]`).click();
    // @ts-ignore
    cy.shouldBeCalled('getUserProfileVerified', 1);

    cy.get(`[data-testid=brightid-connect-success]`).should('exist');
    cy.get(`[data-testid=close-modal]`).click();
    cy.get(`[data-testid=brightid-modal]`).should('not.exist');
    cy.get(`[data-testid=brightid-connected]`).should('exist');
  });
});
