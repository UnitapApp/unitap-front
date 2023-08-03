import { TokenClaimPayload } from '../../src/types';
import { setupGetUserProfileVerified } from '../helpers/auth';
import { tokenTestData } from '../helpers/token-tap';
import { connectWallet, setupEthBridge } from '../helpers/wallet';
import { userMeetNotVerified } from '../utils/data';

let claimsList: TokenClaimPayload[] = [];

const setupGetTokenListServerGeneral = () => {
	cy.intercept(
		{
			method: 'GET',
			url: `/api/tokentap/token-distribution-list/`,
		},
		(req) => req.reply(tokenTestData),
	);

	cy.intercept(
		{
			method: 'GET',
			url: '/api/tokentap/claims-list/',
		},
		(req) => req.reply(claimsList),
	);

	cy.intercept(
		{
			method: 'GET',
			url: '/api/v1/user/remainig-claims/',
		},
		(req) => req.reply({ totalWeeklyClaimsRemaining: 2 }),
	);
};

describe('can claim tokens', () => {
	beforeEach(() => {
		setupEthBridge();
		setupGetTokenListServerGeneral();
		setupGetUserProfileVerified();
	});

	const token = tokenTestData[0];

	it('finds the searched token', () => {
		cy.visit('/token-tap');
		cy.get('[data-testid=search-box]').focus().type(token.name);
		cy.get(`[data-testid=token-name-${token.id}]`).should('exist').and('not.be.empty');
	});

	it('finds the token containing the search box', () => {
		cy.visit('/token-tap');
		cy.get('[data-testid=search-box]').focus().type(token.name.slice(0, 3));
		cy.get(`[data-testid=token-name-${token.id}]`).should('exist').and('not.be.empty');
	});

	it('shows 404 if the token is not found', () => {
		cy.visit('/token-tap');
		cy.get('[data-testid=search-box]').focus().type('invalid token');

		cy.get('[data-testid=tokens-not-found]').should('exist');
	});

	it('checks user permission', () => {
		cy.intercept(
			{
				url: `/api/auth/user/info/`,
				method: 'GET',
			},
			(req) => {
				req.reply(userMeetNotVerified);
			},
		);

		cy.visit('/token-tap');

		cy.get(`[data-testid=token-claim-text-${token.id}]`).should('exist').contains('Complete Verifications');

		cy.get(`[data-testid=token-verification-${token.id}-BrightIDMeetVerification`).should('exist').and('not.be.empty');

		cy.get(`[data-testid=token-verification-${token.id}-OnceInALifeTimeVerification]`)
			.should('exist')
			.and('not.be.empty');
	});

	// it('claims token', () => {
	// 	cy.intercept(
	// 		{
	// 			method: 'POST',
	// 			url: `/api/tokentap/token-distribution/*/claim/`,
	// 		},
	// 		(req) => req.reply(),
	// 	);
	// 	cy.visit('/token-tap');

	// 	connectWallet();

	// 	const token = tokenTestData[0];

	// 	cy.get(`chain-show-claim-${token.id}`).click();
	// 	cy.get(`token-claim-action-${token.chain.pk}`).click();
	// });
});
