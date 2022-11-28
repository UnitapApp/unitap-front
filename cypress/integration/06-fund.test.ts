import {
  chainList,
  chainListAuthenticatedClaimedFirst,
  SAMPLE_ERROR_MESSAGE,
  TEST_ADDRESS_NEVER_USE,
  userProfileVerified
} from "../utils/data";
import RoutePath from "../../src/routes";
import { CustomizedBridge, getCustomizedBridge, TransactionStatus } from "../utils/ethbridge/customizedbridge";
import { CYPRESS_FAST_INTERVAL } from "../../src/constants/intervals";

describe("Submit Fund", () => {
  let ethBridge: CustomizedBridge;
  const selectedChain = chainList[1];

  const connectWallet = () => {
    cy.get("[data-testid=wallet-connect]").click();
    cy.get("[data-testid=wallet-connect]").click();
  };

  const setupGetUserProfileVerified = () => {
    cy.route({
      method: "GET",
      url: `/api/v1/user/${TEST_ADDRESS_NEVER_USE}/`,
      response: userProfileVerified
    });
  };

  const setupGetChainListServerGeneral = () => {
    cy.route({
      method: "GET",
      url: `/api/v1/chain/list/`,
      response: chainList,
      delay: 1000
    });
  };

  const setupGetChainListAuthenticated = () => {
    setupGetChainListServerGeneral();
    cy.route({
      method: "GET",
      url: `/api/v1/chain/list/${TEST_ADDRESS_NEVER_USE}`,
      response: chainListAuthenticatedClaimedFirst,
      delay: CYPRESS_FAST_INTERVAL
    });
  };

  beforeEach(() => {
    ethBridge = getCustomizedBridge();
    ethBridge.setTransactionWaitTime(500);
    cy.on("window:before:load", (win) => {
      // @ts-ignore
      win.ethereum = ethBridge;
      cy.spy(win.console, "error").as("spyWinConsoleError");
      cy.spy(win.console, "warn").as("spyWinConsoleWarn");
    });
    cy.server({ force404: true });
    setupGetUserProfileVerified();
    setupGetChainListAuthenticated();
  });

  afterEach(() => {
    cy.get("@spyWinConsoleError").should("have.callCount", 0);
    cy.get("@spyWinConsoleWarn").should("have.callCount", 0);
  });

  function getReady(fundAmount: string) {
    cy.visit(RoutePath.FUND);
    cy.get("[data-testid=fund-action]").contains("Connect Wallet").click().click();
    // nothing should happen while loading chains
    cy.get("[data-testid=fund-action]").contains("Loading...").click();
    cy.get("[data-testid=fund-chain-dropdown]").click();
    cy.get(`[data-testid=select-chain-modal-item-${selectedChain.pk}]`).click();
    cy.get("[data-testid=fund-action]").contains("Switch Network").click().click();
    cy.get("[data-testid=fund-action]").contains("Submit Contribution").should("have.attr", "disabled");
    cy.get("[data-testid=fund-input]").type(fundAmount);
  }

  function submitFundSuccess(fundAmount: string) {
    cy.window().then((_win) => {
      ethBridge.setTransactionStatus(TransactionStatus.SUCCESS);
      cy.get("[data-testid=fund-action]").contains("Submit Contribution");
      cy.get("[data-testid=fund-action]").click();
      cy.get("[data-testid=fund-action]").contains("Loading...");
      cy.get("[data-testid=fund-success]").contains(fundAmount).contains(selectedChain.symbol);
    });
  }

  function submitFundUserDenied(fundAmount: string) {
    cy.window().then((_win) => {
      ethBridge.setTransactionStatus(TransactionStatus.USER_DENIED);
      cy.get("[data-testid=fund-action]").contains("Submit Contribution").click();
      cy.get("[data-testid=fund-action]").contains("Loading...");
      cy.get("[data-testid=fund-transaction-modal]").should("not.exist");
    });
  }

  function submitFundInsufficientFunds(fundAmount: string) {
    cy.window().then((_win) => {
      ethBridge.setTransactionStatus(TransactionStatus.INSUFFICIENT_FUND);
      cy.get("[data-testid=fund-action]").contains("Submit Contribution").click();
      cy.get("[data-testid=fund-failed]").contains("Insufficient Funds");
      cy.get("[data-testid=fund-try-again]").click();
    });
  }

  function submitFundTransactionError(fundAmount: string) {
    cy.window().then((_win) => {
      ethBridge.setTransactionStatus(TransactionStatus.FAILED);
      cy.get("[data-testid=fund-action]").contains("Submit Contribution").click();
      cy.get("[data-testid=fund-action]").contains("Loading...");
      cy.get("[data-testid=fund-failed]").contains(SAMPLE_ERROR_MESSAGE);
      cy.get("[data-testid=fund-try-again]").click();
    });
  }

  it(`submit fund and handle errors`, () => {
    const fundAmount = "50000";
    getReady(fundAmount);
    submitFundInsufficientFunds(fundAmount);
    submitFundUserDenied(fundAmount);
    submitFundTransactionError(fundAmount);
    submitFundSuccess(fundAmount);
  });
});
