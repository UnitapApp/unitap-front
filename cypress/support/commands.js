// ***********************************************
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

import { BrowserMultiFormatReader } from "@zxing/browser"

const reader = new BrowserMultiFormatReader()

Cypress.Commands.add("shouldBeCalled", (alias, timesCalled) => {
  expect(
    cy.state("requests").filter((call) => call.alias === alias),
    `${alias} should have been called ${timesCalled} times`
  ).to.have.length(timesCalled)
})

// https://github.com/cypress-io/cypress/issues/2752#issuecomment-1039285381
Cypress.on("window:before:load", (win) => {
  let copyText

  if (!win.navigator.clipboard) {
    win.navigator.clipboard = {
      __proto__: {},
    }
  }

  win.navigator.clipboard.__proto__.writeText = (text) => (copyText = text)
  win.navigator.clipboard.__proto__.readText = () => copyText
})

// https://medium.com/cypress-io-thailand/qr-code-barcode-testing-with-cypress-d738f496068b
Cypress.Commands.add("readQRCode", { prevSubject: true }, (subject) => {
  const img = subject[0]
  const image = new Image()
  image.width = img.width
  image.height = img.height
  image.src = img.src
  image.crossOrigin = "Anonymous"
  return reader.decodeFromImageElement(image)
})
