import Icon from 'components/basic/Icon/Icon';
import { Text } from 'components/basic/Text/text.style';
import { LightOutlinedButtonNew } from '../../../../components/basic/Button/button';

const BrightStatusModal = ({ success }: { success: boolean }) => {
	function successState() {
		return (
			<div className="bright-connection-modal flex flex-col items-center justify-center pt-2">
				<Icon iconSrc="./assets/images/modal/bright-icon.svg" mb={2}></Icon>
				<Icon iconSrc="./assets/images/modal/bright-success-icon.svg" mb={2} ml={-1.5}></Icon>
				<Text color="space_green" mb={1} data-testid="brightid-connect-success">
					BrightID Connected
				</Text>
				<Text color="second_gray_light" fontSize="14" textAlign="center" lineHeight="1.5rem" mb={0}>
					Your BrightID connected Successfully
				</Text>
			</div>
		);
	}

	function failedState() {
		return (
			<>
				<div
					className="bright-connection-modal flex flex-col items-center justify-center pt-2"
					data-testid="brightid-modal"
				>
					<Icon
						data-testid="brightid-logo"
						className="bright-logo !w-4/12 z-10 mb-5"
						iconSrc="assets/images/modal/bright-id-logo-checked.svg"
					/>
					<p className="text-sm font-bold text-error mb-2">You are not verified on BrightID</p>
					<p className="text-xs font-medium text-gray100 mb-12 text-center px-4 leading-6">
						BrightID is a social identity network that allows users to prove that they are only using one account.
					</p>

					<span className="w-full relative">
						<LightOutlinedButtonNew
							className="!w-full"
							onClick={() => window.open('https://meet.brightid.org/', '_blank')}
						>
							Verify on BrightID{' '}
							<Icon className="cursor-pointer arrow-icon mt-0.5 ml-1.5 w-2" iconSrc="assets/images/arrow-icon.svg" />
						</LightOutlinedButtonNew>
						<Icon
							iconSrc="assets/images/modal/bright-id-check.svg"
							className="w-6 h-6 absolute right-4 top-1/2 -translate-y-1/2"
						/>
					</span>

					{/* eslint-disable-next-line no-restricted-globals */}
					<p className="text-white mt-4 text-xs hover:underline cursor-pointer" onClick={() => location.reload()}>
						If you verified your BrightID click here.
					</p>
				</div>
			</>
		);
	}

	return <div>{success ? successState() : failedState()}</div>;
};

export default BrightStatusModal;
