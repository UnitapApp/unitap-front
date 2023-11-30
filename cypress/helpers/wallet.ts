import { generateTestingUtils } from "eth-testing"

export const setupEthBridge = () => {
  // cy.on("window:before:load", () => {

  // ;(window as any).ethereum = testingUtils.getProvider()
  // })

  cy.intercept(
    {
      url: "/api/auth/user/set-wallet/",
      method: "POST",
    },
    (req) => req.reply([])
  )
}

export const connectWallet = () => {
  cy.get("[data-testid=wallet-connect]").click()
  // cy.get("[data-testid=wallet-connect]").click()
  cy.wait(200).get("[data-testid=wallet-connect-method-Metamask]").click()
}
