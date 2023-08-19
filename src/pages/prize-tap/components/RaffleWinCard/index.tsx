import { PrizeTapCard } from 'components/basic/Button/button';
import Icon from 'components/basic/Icon/Icon';

const RaffleWinCard = () => {
	return (
		<PrizeTapCard className="rounded-lg p-1 !w-96 !h-30 text-white relative">
			<p className="text-xs">
				Congratulations, @MZMN on your grand prize win! Don't wait - claim your prize now.
				<div className="text-base !font-bold mt-2 flex items-center">
					<span>Go to Prize Tap</span>
					<Icon iconSrc="/assets/images/prize-tap/arrow-right.svg" className="ml-2" width="12px" />
				</div>
			</p>
		</PrizeTapCard>
	);
};

export default RaffleWinCard;
