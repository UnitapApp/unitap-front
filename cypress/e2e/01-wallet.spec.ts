import RoutePath from '../../src/routes';
import { formatChainId } from '../../src/utils';
import { setupGetUserProfileVerified } from '../helpers/auth';
import { clearGasTapFilters } from '../helpers/gas-tap';
import { connectWallet, setupEthBridge } from '../helpers/wallet';
import { TEST_ADDRESS_NEVER_USE_SHORTENED, chainList, claimMaxResponse } from '../utils/data';
import { getCustomizedBridge } from '../utils/ethbridge/customizedbridge';

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

describe('wallet interaction', () => {
	beforeEach(() => {
		setupGetChainListServerGeneral();
		setupGetUserProfileVerified();
		setupEthBridge();
	});

	it('connects to eth wallet', () => {
		cy.visit(RoutePath.FAUCET);

		cy.get('[data-testid=wallet-connect]').contains('Connect Wallet');

		connectWallet();

		cy.get('[data-testid=wallet-address]').contains(TEST_ADDRESS_NEVER_USE_SHORTENED);
	});

	it('switches to network', () => {
		cy.on('window:before:load', (win) => {
			// @ts-ignore
			cy.spy(win.ethereum, 'switchEthereumChainSpy');
		});

		cy.visit(RoutePath.FAUCET);
		connectWallet();

		clearGasTapFilters();

		cy.get(`[data-testid=chain-switch-${chainList[0].pk}]`).click();
		const expectedChainId = formatChainId(chainList[0].chainId!);

		cy.window().then((win) => {
			// @ts-ignore
			expect(win.ethereum.switchEthereumChainSpy).to.have.calledWith(expectedChainId);
		});
	});

	it('adds network', () => {
		const ethBridge = getCustomizedBridge();
		cy.on('window:before:load', (win) => {
			cy.spy(ethBridge, 'switchEthereumChainSpy');
			cy.spy(ethBridge, 'addEthereumChainSpy');
			// @ts-ignore
			win.ethereum = ethBridge;
		});

		cy.visit(RoutePath.FAUCET);
		connectWallet();

		clearGasTapFilters();

		cy.get(`[data-testid=chain-switch-${chainList[0].pk}]`).click();
		cy.get(`[data-testid=chain-switch-${chainList[0].pk}]`).click();
		cy.get(`[data-testid=chain-id]`).contains(chainList[0].chainId!);
		const expectedChainId = formatChainId(chainList[0].chainId!);

		cy.window().then((win) => {
			expect(ethBridge.switchEthereumChainSpy).to.have.calledTwice;
			expect(ethBridge.switchEthereumChainSpy).to.have.calledWith(expectedChainId);
			expect(ethBridge.addEthereumChainSpy).to.have.calledWith(expectedChainId);
		});
	});
});
