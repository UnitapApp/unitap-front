import { useContext, useEffect, useState } from 'react';
import Header from './components/Header/header';
import SearchInput from './components/SearchInput/searchInput';
import Dropdown from './components/Dropdown/dropdown';
import Pagination from './components/Pagination/pagination';
import UsersList from './components/UsersList/usersList';
import { getLeaderBoardPaginated, getUserRankLeaderBoard } from 'api';
import { UserProfileContext } from 'hooks/useUserProfile';

const Leaderboard = () => {
	const [loading, setLoading] = useState(true);
	const [data, setData] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [pagination, setPagination] = useState({ previous: null, next: null, count: 0 });

	const { userToken } = useContext(UserProfileContext);

	let [currentUser, setCurrentUser] = useState(null);

	useEffect(() => {
		getLeaderBoardPaginated(currentPage).then((res) => {
			setData(res.results);
			setPagination({
				previous: res.previous,
				next: res.next,
				count: res.count,
			});

			setLoading(false);
		});
	}, [currentPage]);

	useEffect(() => {
		if (!userToken) return;

		getUserRankLeaderBoard(userToken).then((res) => setCurrentUser(res));
	}, [userToken]);

	return (
		<>
			<div className="content-wrapper text-white">
				<div className="m-auto flex flex-col justify-center items-center w-full">
					<div className="flex wrap w-full">
						<Header />
					</div>
					<div className="bg-gray20 rounded-2xl wrap w-full p-4 ">
						<div className="justify-between sm:flex">
							<SearchInput />
							<Dropdown />
						</div>
						{loading ? (
							<div className="text-center mt-10">Loading...</div>
						) : (
							<>
								<UsersList
									next={pagination.next}
									previous={pagination.previous}
									page={currentPage}
									users={data}
									currentUser={currentUser}
								/>
								<Pagination
									next={pagination.next}
									previous={pagination.previous}
									currentPage={currentPage}
									onClick={(page) => setCurrentPage(page)}
								/>
							</>
						)}
					</div>
				</div>
			</div>
		</>
	);
};

export default Leaderboard;
