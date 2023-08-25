import Icon from 'components/basic/Icon/Icon';
import { HeaderWrapper } from 'pages/fund/components/Header/header.style';

const Header = () => {
	return (
		<HeaderWrapper>
			{/* <Icon className="text" iconSrc={'assets/images/fund/header-gas-fund-fee-text.png'} width="320px" height="auto" /> */}
			<Icon className="spaceman" iconSrc={'assets/images/fund/header-spaceman.png'} width="220px" height="auto" />
		</HeaderWrapper>
	);
};

export default Header;
