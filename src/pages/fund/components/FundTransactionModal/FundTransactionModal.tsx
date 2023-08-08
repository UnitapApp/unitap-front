import { FundTransactionModalWrapper } from './FundTransactionModal.style';
import Icon from 'components/basic/Icon/Icon';
import { Text } from 'components/basic/Text/text.style';
import { SecondaryButton } from 'components/basic/Button/button';
import { Chain } from '../../../../types';
import { formatBalance } from '../../../../utils/numbers';
import { getTxUrl } from '../../../../utils';

const FundTransactionModal = ({
	selectedChain,
	txHash,
	provideGasFeeError,
	closeModalHandler,
	fundAmount,
}: {
	provideGasFeeError: string;
	txHash: string;
	selectedChain: Chain | null;
	closeModalHandler: () => void;
	fundAmount: string;
}) => {
	function successful() {
		const handleClick = () => {
			const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
				`I donated to @Unitap_app's ${
					selectedChain!.chainName
				} faucet 💚💜\nJoin me in making Web3 more accessible for everyone!\nDonate: `,
			)}&url=${encodeURIComponent('unitap.app/fund?chain=' + encodeURIComponent(selectedChain!.pk))}`;
			window.open(twitterUrl, '_blank');
		};
		return (
			<>
				<Icon mb={3} iconSrc="assets/images/fund/success-provide-spaceman.svg"></Icon>
				{selectedChain && (
					<>
						<Text fontSize="14px" color="space_green" textAlign="center" breakOverflow data-testid="fund-success">
							Thanks for your donation!
							<br />
							{formatBalance(Number(fundAmount))} {selectedChain.symbol} donation transaction submitted
						</Text>

						<Text
							width="100%"
							fontSize="14"
							color="second_gray_light"
							className="underline cursor-pointer"
							mb={3}
							textAlign="center"
							onClick={() => {
								window.open(getTxUrl(selectedChain, txHash), '_blank');
							}}
						>
							View on Explorer
						</Text>

						<div className="relative w-full">
							<button
								onClick={handleClick}
								className={`gradient-outline-twitter-button w-full flex items-center justify-center bg-gray00 transition-all duration-75 hover:bg-gray20 rounded-xl border-gray00 px-3 py-4`}
							>
								<p className="text-sm font-semibold text-twitter">Share on Twitter</p>
							</button>
							<Icon
								iconSrc="/assets/images/gas-tap/twitter-share.svg"
								className="w-6 h-6 absolute right-4 top-1/2 z-10 pointer-events-none -translate-y-1/2"
								width="auto"
								height="26px"
							/>
						</div>
					</>
				)}
			</>
		);
	}

	function failed() {
		return (
			<>
				<Icon mb={3} iconSrc="assets/images/fund/failed-provide-spaceman.svg"></Icon>
				<Text fontSize="14px" color="warningRed" textAlign="center" breakOverflow data-testid="fund-failed">
					{provideGasFeeError}
				</Text>
				<SecondaryButton onClick={closeModalHandler} fontSize="14px" size="large" data-testid="fund-try-again">
					Try Again
				</SecondaryButton>
			</>
		);
	}

	return (
		<FundTransactionModalWrapper data-testid="fund-transaction-modal">
			{provideGasFeeError ? failed() : successful()}
		</FundTransactionModalWrapper>
	);
};

export default FundTransactionModal;
