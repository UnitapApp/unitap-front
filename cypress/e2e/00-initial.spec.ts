import RoutePath from "@/utils/routes";
import { setupGetUserProfileVerified } from "../helpers/auth";
import { TEST_ADDRESS_NEVER_USE_SHORTENED } from "../utils/data";

describe("initial config check", () => {
  beforeEach(() => {
    setupGetUserProfileVerified();
  });

  it("is everything defined", () => {
    cy.visit(RoutePath.HOME);

    cy.get("[data-testid=wallet-address]").contains(
      TEST_ADDRESS_NEVER_USE_SHORTENED
    );
  });
});

cy.on("uncaught:exception", () => {
  return false;
});
