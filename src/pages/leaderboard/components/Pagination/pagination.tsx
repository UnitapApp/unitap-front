import Icon from 'components/basic/Icon/Icon';

interface Props {
	onClick: (page: number) => void;
	next: number | null;
	previous: number | null;
	currentPage: number;
}

const Pagination = ({ onClick, next, previous, currentPage }: Props) => {
	return (
		<div className="flex justify-center items-center ">
			<div className="flex gap-5 text-white items-center align-center mt-4">
				{previous !== null && (
					<Icon
						iconSrc="assets/images/leaderboard/arrow-left.svg"
						width="8px"
						height="14px"
						hoverable
						onClick={() => onClick(currentPage - 1)}
					/>
				)}

				<p className="text-[14px]">
					[{(currentPage - 1) * 10} - {currentPage * 10}]
				</p>
				{next !== null && (
					<Icon
						iconSrc="assets/images/leaderboard/arrow-right.svg"
						width="8px"
						height="14px"
						hoverable
						onClick={() => onClick(currentPage + 1)}
					/>
				)}
			</div>
		</div>
	);
};

export default Pagination;
