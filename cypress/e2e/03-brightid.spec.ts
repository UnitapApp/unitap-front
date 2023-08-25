import RoutePath from '../../src/routes';
import { getVerificationQr } from '../../src/utils';
import { setupGetUserProfileNotVerified, setupGetUserProfileVerified } from '../helpers/auth';
import { connectWallet, setupEthBridge } from '../helpers/wallet';
import { chainList, userProfileVerified } from '../utils/data';

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
		(req) => req.reply([]),
	);

	cy.intercept(
		{
			method: 'GET',
			url: '/api/v1/user/remainig-claims/',
		},
		(req) => req.reply({ totalWeeklyClaimsRemaining: 2 }),
	);
};

describe('BrightID interaction', () => {
	beforeEach(() => {
		setupEthBridge();
		setupGetChainListServerGeneral();
	});

	it('does not show BrightID linking when verified', () => {
		setupGetUserProfileVerified();
		cy.visit(RoutePath.FAUCET);
		connectWallet();

		cy.get(`[data-testid=brightid-modal]`).should('not.exist');
	});

	const openBrightIdModal = () => {
		setupGetUserProfileNotVerified();
		cy.visit(RoutePath.FAUCET);
		cy.get(`[data-testid=brightid-show-modal]`).contains('Connect').click();
		cy.get(`[data-testid=brightid-modal]`).should('exist');
	};

	it('closes modal on click outside', () => {
		openBrightIdModal();
		cy.get(`[data-testid=brightid-modal]`).should('exist');
		cy.get(`[data-testid=modal-content]`).click();
		cy.get(`[data-testid=brightid-modal]`).should('exist');
		cy.get(`[data-testid=modal-wrapper]`).click('left');
		cy.get(`[data-testid=brightid-modal]`).should('not.exist');
	});

	// it('copies BrightID linking url when not verified', () => {
	// 	Cypress.on('window:before:load', (win) => {
	// 		cy.spy(win.navigator.clipboard, 'writeText');
	// 	});
	// 	openBrightIdModal();

	// 	cy.get('[data-testid=setup-bright-id-qr-code]').click();

	// 	cy.get(`[data-testid=brightid-copy-link]`).click();

	// 	cy.window().then((win) => {
	// 		expect(win.navigator.clipboard.writeText).to.have.calledWith(userProfileVerified.verificationUrl);
	// 	});
	// });

	// it('shows linking qr and url when not verified', () => {
	// 	openBrightIdModal();
	// 	const qrText = getVerificationQr();

	// 	(cy.get(`[data-testid=brightid-qr]`) as any).readQRCode().should('have.property', 'text', qrText);
	// });
});
