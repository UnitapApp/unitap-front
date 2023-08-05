import { FC } from 'react';

const NotAvailableTap: FC = () => {
	return (
		<div className="absolute inset-0 z-10 flex items-center justify-center">
			<h5 className="text-white p-3 text-center text-lg">Gas Tap is not available right now</h5>
		</div>
	);
};

export default NotAvailableTap;
