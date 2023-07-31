import { useState } from 'react';
import Footer from '../../components/common/Footer/footer';

const Home = () => {
	const [networks] = useState([
		{
			name: 'Bitcoin',
			icon: 'btc.svg',
			address: 'bc1qpcn3ztcgltws9ced8ktmn075dmqvj7dxu73fag',
			qr: 'btc-address.png',
			isSelected: false,
		},
		{
			name: 'EVM Networks',
			icon: 'eth.svg',
			address: '0xdB1F064C0b188a95b7801050474Da26fc95eb01E',
			qr: 'ETH-address.png',
			isSelected: false,
		},
		{
			name: 'Solana',
			icon: 'solana.svg',
			address: 'pRogDW5qSapudKBgeD2oTSaKku4jNgn3FE7RXo1ojrb',
			qr: 'solana-address.png',
			isSelected: false,
		},
	]);

	const [selectedNetwork, setSelectedNetwork] = useState({
		name: '',
		icon: '',
		address: '',
		qr: '',
		isSelected: false,
	});

	function selectNetwork(index: number) {
		networks.forEach((net) => {
			net.isSelected = false;
		});
		setSelectedNetwork(networks[index]);
		networks[index].isSelected = true;
	}

	function copyToClipboard(address: string) {
		// Get the text field

		// Copy the text inside the text field
		navigator.clipboard.writeText(address);

		// Alert the copied text
		alert('Address copied :)');
	}

	return (
		<>
			<div className={'content-wrapper flex justify-center items-center px-4 py-8'}>
				<div className={'uni-card mt-9 sm:mt-0 after:bg-donate-texture-p  after:w-60 after:top-0 after:h-56 px-4 py-6'}>
					<div className={'h-72 flex flex-col justify-end items-center mb-12'}>
						{selectedNetwork.name && <p className={'text-white font-semibold text-lg z-10 relative'}>Unitap Wallet</p>}
						<img
							src={`/assets/images/donate/${selectedNetwork.qr ? selectedNetwork.qr : 'donate-img.png'}`}
							className={`${selectedNetwork.qr ? 'w-52' : 'w-36'} relative  m-auto z-10`}
						/>
						{selectedNetwork.name && (
							<div className={'flex gap-2'}>
								<p className={'text-space-green text-[11px] sm:text-base'}>{selectedNetwork.address} </p>
								<img
									onClick={() => copyToClipboard(selectedNetwork.address)}
									src={'/assets/images/donate/copy-green.svg'}
									className={'cursor-pointer inline-block'}
								/>
							</div>
						)}
					</div>
					<h2 className={'text-white mb-4'}>Donate to Unitap</h2>

					<p className={'text-gray100 mb-8 text-xs'}>
						Select a network to view Unitap wallet address and easily donate to Unitap.
					</p>
					<label className={'text-gray90 text-xs mb-2 inline-block'}>Select network</label>
					<div className={'flex flex-col sm:flex-row justify-between gap-2 '}>
						{networks.map((network, index) => (
							<div
								onClick={() => selectNetwork(index)}
								key={network.name}
								className={`${
									network.isSelected
										? 'gradient-outline-button bg-gray00 before:rounded-[11px] before:inset-[0.1rem] '
										: 'border-gray50 bg-gray30 border-2'
								} sm:w-36 cursor-pointer  text-white rounded-xl transition-colors hover:bg-gray00 duration-200 flex gap-2 flex-col justify-center items-center px-2 py-3`}
							>
								<img src={`/assets/images/donate/${network.icon}`} />
								<p className={'text-xs'}>{network.name}</p>
							</div>
						))}
					</div>
				</div>
			</div>
			<Footer />
		</>
	);
};

export default Home;
