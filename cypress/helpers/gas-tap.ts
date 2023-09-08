export const clearGasTapFilters = () => {
	cy.get('[data-testid=chains-filter-all]').click();
	cy.get('[data-testid=chains-filter-chain-type-all]').click();
};
