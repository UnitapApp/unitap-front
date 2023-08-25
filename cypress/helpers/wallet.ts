import { getCustomizedBridge } from '../utils/ethbridge/customizedbridge';

export const setupEthBridge = () => {
	cy.on('window:before:load', (win) => {
		// @ts-ignore
		win.ethereum = getCustomizedBridge();
	});

	cy.intercept(
		{
			url: '/api/auth/user/set-wallet/',
			method: 'POST',
		},
		(req) => req.reply([]),
	);
};

export const connectWallet = () => {
	cy.get('[data-testid=wallet-connect]').click();
	cy.get('[data-testid=wallet-connect]').click();
};
