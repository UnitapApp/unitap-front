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
    cy.server({ force404: true });
    setupEthBridge();
    setupGetChainListAuthenticated();
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
    cy.get(`[data-testid=brightid-qr]`);
  });
});
