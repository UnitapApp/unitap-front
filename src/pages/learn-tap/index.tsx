import { GradientOutlinedButton } from 'components/basic/Button/button';

const LearnTap = () => {
	return (
		<div className="content-wrapper">
			<section className="h-48 rounded-xl bg-learn-tap-texture py-8 bg-cover flex-col flex items-center justify-between">
				<p className="text-secondary-text">Are you new to Web3 ?</p>
				<h2 className="text-white font-normal">Mission to Web3</h2>
				<GradientOutlinedButton className="gradient-learn-tap-button !w-56">
					<p>Get started</p>
				</GradientOutlinedButton>
			</section>
		</div>
	);
};

export default LearnTap;
