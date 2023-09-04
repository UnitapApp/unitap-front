import { EnrolledButton } from 'components/basic/Button/button';
import LearnTapProvider from 'hooks/learn-tap/learnTapContext';
import SearchInput from './components/SearchInput/searchInput';
import { Link } from 'react-router-dom';
import RoutePath from 'routes';

const LearnTap = () => {
	return (
		<LearnTapProvider>
			<div className="content-wrapper text-white">
				<section className="h-48 rounded-xl bg-learn-tap-texture py-8 bg-cover flex-col flex items-center justify-between">
					<p className="text-secondary-text">Are you new to Web3 ?</p>
					<h2 className="text-white mt-5 font-normal">Mission to Web3</h2>
					<Link to={RoutePath.MISSIONS}>
						<EnrolledButton className="!w-56 !rounded-lg before:!rounded-lg mt-5">
							<p className="!rounded-lg">Get started</p>
						</EnrolledButton>
					</Link>
				</section>

				<section className="p-4 h-80 rounded-lg bg-gray20 mt-5">
					<div className="flex items-center justify-between">
						<p className="text-lg">LearnTap Missions</p>
						<SearchInput />
					</div>
				</section>
			</div>
		</LearnTapProvider>
	);
};

export default LearnTap;
