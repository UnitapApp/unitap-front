import { userProfileVerified, emptyClaimHistoryResponse } from '../utils/data';

export const setupGetUserProfileVerified = () => {
	cy.intercept(
		{
			url: `/api/auth/user/info/`,
			method: 'GET',
		},
		(req) => {
			req.reply(userProfileVerified);
		},
	);

	cy.intercept(
		{
			method: 'GET',
			url: '/api/v1/settings',
		},
		(req) =>
			req.reply({
				isGasTapAvailable: true,
				prizetapWeeklyClaimLimit: 3,
				tokentapWeeklyClaimLimit: 20,
				weeklyChainClaimLimit: 5,
			}),
	);

	cy.intercept(
		{
			method: 'GET',
			url: `/api/v1/user/**/claims?**`,
		},
		(req) => {
			req.reply(emptyClaimHistoryResponse);
		},
	);

	localStorage.setItem('userToken', 'b12321d8ye8834y273627e27');
};

export const setupGetUserProfileNotVerified = () => {
	cy.clearLocalStorage();
	cy.clearAllCookies();
};
