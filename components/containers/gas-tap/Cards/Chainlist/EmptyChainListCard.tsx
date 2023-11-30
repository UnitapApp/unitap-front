const EmptyChainListCard = () => {
	return (
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
