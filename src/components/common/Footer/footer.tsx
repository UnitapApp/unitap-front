import { FC } from 'react';
import styled from 'styled-components';

import { DV } from 'components/basic/designVariables';

import Icon from 'components/basic/Icon/Icon';

const FooterWrapper = styled.div`
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	height: 65px;
	padding: ${DV.sizes.basePadding * 2}px;
	background: ${DV.colors.black3};
	//bottom: 0;
	//position: absolute;
`;

const PbyBright = styled(Icon)`
	position: absolute;
	right: ${DV.sizes.basePadding * 10}px;

	@media only screen and (max-width: ${DV.breakpoints.mobile}) {
		display: none;
	}
`;

const Footer: FC = () => {
	return (
		<FooterWrapper>
			<span onClick={() => window.open('http://twitter.com/unitap_app', '_blank')}>
				<Icon iconSrc="assets/images/footer/twitter.svg" width="34px" height="auto" mr={4} hoverable></Icon>
			</span>
			<span onClick={() => window.open('https://github.com/UnitapApp', '_blank')}>
				<Icon iconSrc="assets/images/footer/github.svg" width="34px" height="auto" mr={4} hoverable></Icon>
			</span>
			<span onClick={() => window.open('https://discord.gg/unitap', '_blank')}>
				<Icon iconSrc="assets/images/footer/discord.svg" width="34px" height="auto" hoverable></Icon>
			</span>
			<PbyBright iconSrc="Poweredbybright.svg" width="160px" height="auto"></PbyBright>
		</FooterWrapper>
	);
};

export default Footer;
