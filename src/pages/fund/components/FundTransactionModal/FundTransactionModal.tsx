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
						<SecondaryButton
							fontSize="14px"
							size="large"
							onClick={() => {
								window.open(getTxUrl(selectedChain, txHash), '_blank');
							}}
						>
							View on Explorer
						</SecondaryButton>
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
