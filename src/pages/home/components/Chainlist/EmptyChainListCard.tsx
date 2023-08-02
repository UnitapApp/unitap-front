const EmptyChainListCard = () => {
	return (
		// <div className="empty-chain-list-card flex flex-col rounded-xl w-full overflow-hidden">
		// 	<div className="empty-chain-list-card__top flex gap-4 flex-col sm:flex-row justify-between pl-3 pr-6 py-4">
		// 		<span className="empty-chain-list-card__info flex w-full items-center justify-center sm:justify-start gap-3">
		// 			<span className="empty-chain-list-card__info__logo w-11 h-11 rounded-full"></span>
		// 			<p className="empty-chain-list-card__info__name text-white">Chain Not Found</p>
		// 		</span>
		// 		<span className="empty-chain-list-card__actions flex flex-col w-full items-center sm:justify-end sm:flex-row gap-2 sm:gap-4">
		// 			<span className="empty-chain-list-card__actions__action w-24 h-11 rounded-lg"></span>
		// 			<span className="empty-chain-list-card__actions__action w-56 h-11 rounded-lg"></span>
		// 		</span>
		// 	</div>
		// 	<div className="empty-chain-list-card__bottom flex flex-col sm:flex-row justify-between items-center py-2.5 px-9">
		// 		<span className="flex justify-between w-full sm:justify-start">
		// 			<p className="chain-card__info__title text-sm text-gray90">Currency</p>
		// 			<p className="chain-card__info__value font-mono text-sm text-white ml-1.5">404</p>
		// 		</span>
		// 		<span className="flex justify-between w-full sm:justify-center">
		// 			<p className="chain-card__info__title text-sm text-gray90">Claims This Round</p>
		// 			<p className="chain-card__info__value font-mono text-sm text-white ml-1.5">404</p>
		// 		</span>
		// 		<span className="flex justify-between w-full sm:justify-end">
		// 			<p className="chain-card__info__title text-sm text-gray90">Total Claims</p>
		// 			<p className="chain-card__info__value font-mono text-sm text-white ml-1.5">404</p>
		// 		</span>
		// 	</div>
		// </div>
		<div data-testid="chains-not-found" className="mt-5">
			<div className="bg-gray30 text-white shadow-lg rounded-lg p-6 mx-auto">
				<div className="flex justify-center items-center h-20">
					<h1 className="text-4xl bg-primaryGradient text-transparent bg-clip-text font-semibold">404</h1>
				</div>
				<p className="text-center mb-6">No chain with the current filter could be found.</p>
			</div>
		</div>
	);
};

export default EmptyChainListCard;
