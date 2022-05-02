import { CustomizedBridge, provider, signer } from '../support/commands';
import {
  chainList,
  chainListAuthenticatedClaimedFirst,
  TEST_ADDRESS_NEVER_USE,
  userProfileNotVerified,
  userProfileVerified,
} from '../utils/data';

describe('BrightID', () => {
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
    });
  };

  const setupGetUserProfileVerified = () => {
    cy.route({
      method: 'GET',
      url: `/api/v1/user/${TEST_ADDRESS_NEVER_USE}/`,
      response: userProfileVerified,
    });
  };
  it('does not show BrightID linking when verified', () => {
    setupGetUserProfileVerified();
    cy.visit('/');
    cy.get(`[data-testid=brightid-show-modal]`).contains('BrightID Connected').click();
    cy.get(`[data-testid=brightid-modal]`).should('not.exist');
  });

  function openBrightIdModal() {
    setupGetUserProfileNotVerified();
    cy.visit('/');
    cy.get(`[data-testid=brightid-show-modal]`).contains('Connect BrightID').click();
    cy.get(`[data-testid=brightid-modal]`).should('exist');
  }

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
    const qrText = userProfileVerified.verificationUrl;
    // @ts-ignore
    cy.get(`[data-testid=brightid-qr]`).readQRCode().should('have.property', 'text', qrText);
  });
});
