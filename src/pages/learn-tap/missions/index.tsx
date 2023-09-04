import { ClaimButton } from 'components/basic/Button/button';
import Icon from 'components/basic/Icon/Icon';
import { SuccessMessageButton } from 'components/basic/MessageButton/messageButton.style';
import Youtube, { YouTubeProps } from 'react-youtube';

const YoutubeOptions: YouTubeProps['opts'] = {
	width: '100%',
	height: '424px',
	playerVars: {
		modestbranding: 1,
		controls: 0,
	},
};

const Missions = () => {
	return (
		<div className="content-wrapper !max-w-screen-[1500px] flex items-center !flex-row gap-4 flex-wrap text-white">
			<div className="min-h-[calc(100vh_-_64px_-_108px)] rounded-lg bg-gray20 w-72 p-2">
				<div className="bg-gray30 rounded-xl">
					<div className="h-44 bg-cover rounded-xl bg-[url('/assets/images/learn-tap/light.svg')] p-4">
						<p className="text-secondary text-lg">Mission to Web3</p>
						<p className="mt-5 text-secondary-text text-sm">Get ready for a fun ride into the future</p>
						<div className="mt-8">
							<span className="bg-gray30 secondary-button px-2 py-1 border border-gray70 text-sm rounded-lg">
								<span className="bg-g-primary bg-clip-text text-transparent">170 XP</span>
							</span>
						</div>
					</div>
				</div>
				<div className="mx-2">
					<ClaimButton className="!p-1.5 !w-full mt-2"></ClaimButton>
				</div>

				<div className="mt-5">
					<p className="text-gray100">Map</p>
				</div>
			</div>

			<div className="flex-1 min-h-[calc(100vh_-_64px_-_108px)] rounded-xl p-2 bg-gray20">
				<Youtube
					iframeClassName="rounded-lg"
					className="h-[424px]"
					videoId="Ata9cSC2WpM"
					opts={YoutubeOptions}
				></Youtube>

				<div className="flex items-center justify-between mt-8">
					<p className="text-secondary">Intro to Web3</p>
					<SuccessMessageButton className="!bg-none flex items-center justify-between !bg-dark-space-green !px-2 !rounded-lg !py-1 !text-sm">
						<p>+10 XP</p>
						<Icon className="ml-4" iconSrc="/assets/images/learn-tap/green-check.svg" />
					</SuccessMessageButton>
				</div>
				<div className="mt-10 text-secondary-text text-sm text-justify leading-loose">
					Get ready for a fun ride into the Web3, Get ready for a fun ride into the Web3, Get ready for a fun ride into
					the Web3, Get ready for a fun ride into the Web3, Get ready for a fun ride into the Web3, Get ready for a fun
					ride into the Web3.
				</div>
			</div>
		</div>
	);
};

export default Missions;
