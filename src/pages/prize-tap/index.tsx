import Header from './components/Header/header';
import Footer from 'components/common/Footer/footer';
import RafflesList from './components/RafflesList/RafflesList';
import EnrollModal from './components/EnrollModal';
import BrightConnectionModal from 'pages/home/components/BrightConnectionModal/brightConnectionModal';
// import RaffleWinCard from './components/RaffleWinCard';

const PrizeTap = () => {
	return (
		<div className="prize-tap">
			<div className="content-wrapper">
				<Header />
				<RafflesList />
			</div>
			<Footer />
			<EnrollModal />
			<BrightConnectionModal />
		</div>
	);
};

export default PrizeTap;
