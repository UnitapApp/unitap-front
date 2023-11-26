import RoutePath from "@/utils/routes"

describe("Test if pages working", () => {
  it("visits landing page", () => {
    cy.visit(RoutePath.HOME)
  })
})

cy.on("uncaught:exception", () => {
  return false
})
