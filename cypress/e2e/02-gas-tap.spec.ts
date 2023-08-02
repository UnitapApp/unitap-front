// gas-tap.spec.ts created with Cypress
//
// Start writing your Cypress tests below!
// If you're unfamiliar with how Cypress works,
// check out the link below and learn how to write your first test:
// https://on.cypress.io/writing-first-test

import RoutePath from '../../src/routes';
import { Chain, ClaimReceipt, ClaimReceiptState } from '../../src/types';
import { setupGetUserProfileVerified } from '../helpers/auth';
import { connectWallet, setupEthBridge } from '../helpers/wallet';
import { chainList, claimMaxResponse, createClaimHistory } from '../utils/data';

let collectedChains: (Omit<ClaimReceipt, 'chain'> & {
	chain: number;
})[] = [];

const setupGetChainListServerGeneral = () => {
	cy.intercept(
		{
			method: 'GET',
			url: `/api/v1/chain/list/`,
		},
		(req) => req.reply(chainList),
	);

	cy.intercept(
		{
			method: 'GET',
			url: '/api/v1/user/claims/',
		},
		(req) => req.reply(collectedChains),
	);

	cy.intercept(
		{
			method: 'POST',
			url: '/api/v1/chain/**/claim-max',
		},
		(req) => {
			const chain = chainList.find((item) => item.pk === 2)!;

			collectedChains.push(createClaimHistory(chain as any, ClaimReceiptState.VERIFIED, chain.pk!));

			return req.reply(claimMaxResponse);
		},
	);

	cy.intercept(
		{
			method: 'GET',
			url: '/api/v1/user/remainig-claims/',
		},
		(req) => req.reply({ totalWeeklyClaimsRemaining: 2 }),
	);
};

describe('can claim gasses', () => {
	beforeEach(() => {
		collectedChains = [];
		setupGetChainListServerGeneral();
		setupGetUserProfileVerified();
		setupEthBridge();
	});

	it('should show the claim cards empty', () => {
		cy.visit(RoutePath.FAUCET);
		cy.get('[data-testid=claims-chain-list]').should('be.visible').and('not.be.empty');
	});

	it('collects gas correctly', () => {
		cy.visit(RoutePath.FAUCET);

		connectWallet();

		cy.get('[data-testid=chain-show-claim-2]').click();
		cy
			// .wait('wait for modal', { timeout: 100 })
			.get('[data-testid=chain-claim-action-2]')
			.click();

		// cy.wait('wait for refresh response', { timeout: 3000 });

		cy.get('[data-testid=chain-claim-success-2]').should('exist');
	});
});
