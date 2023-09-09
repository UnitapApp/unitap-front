import React, { useEffect, useState } from 'react';
import Navbar from 'components/common/Navbar/navbar';
import Header from './components/Header/header';
import SearchInput from './components/SearchInput/searchInput';
import Dropdown from './components/Dropdown/dropdown';
import Pagination from './components/Pagination/pagination';
import UsersList from './components/UsersList/usersList';
import { users } from 'constants/usersList';
import { getLeaderBoardPaginated } from 'api';

const Leaderboard = () => {
	const [records, setRecords] = useState({
		start: users.length == 0 ? 0 : 1,
		end: users.length >= 10 ? 10 : users.length,
	});

	const [loading, setLoading] = useState(true);
	const [chains, setChains] = useState([]);
	const [data, setData] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [pagination, setPagination] = useState({ previous: null, next: null, count: 0 });

	let currentUser = users.filter((user) => user.username === '@This is a test')[0];
	let displayUser = users.slice(records.start - 1, records.end);

	const handlePagination = (start: number, end: number) => {
		if (start > users.length || start < 1) return;
		setRecords({ ...records, start: start, end: end >= users.length ? users.length : end });
	};

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
								<UsersList page={currentPage} users={data} currentUser={currentUser} />
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
