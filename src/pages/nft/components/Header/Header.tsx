import styled from 'styled-components/';

const Spaceship = styled.img`
	position: absolute;
	right: 0;
	transform: translate(-5%, -34%);
`;

const Header = () => {
	return (
		<div className="header w-full h-[202px] bg-gray20 rounded-2xl flex flex-col gap-5 justify-end items-start overflow-hidden relative pl-6 pb-5 mb-4">
			<div className="header-top z-10 flex items-center h-auto">
				<img className="gas-tap h-[48px] w-auto sm:w-auto" src="assets/images/nft/mint-header.png" />
			</div>

			<p className="gradient-text z-10 text-white">Unitap Pass is a VIP pass for Unitap.</p>

			<Spaceship className="z-0" src="assets/images/nft/nft-header-spaceship.svg" />
		</div>
	);
};

export default Header;
