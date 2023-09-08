import React, { useState } from 'react';
import Navbar from 'components/common/Navbar/navbar';
import Header from './components/Header/header';
import SearchInput from './components/SearchInput/searchInput';
import Dropdown from './components/Dropdown/dropdown';
import Pagination from './components/Pagination/pagination';
import UsersList from './components/UsersList/usersList';
import { users } from 'constants/usersList';

const Leaderboard = () => {
	const [records, setRecords] = useState({
		start: users.length == 0 ? 0 : 1,
		end: users.length >= 10 ? 10 : users.length,
	});

	let currentUser = users.filter((user) => user.userName === '@This is a test')[0];
	let displayUser = users.slice(records.start - 1, records.end);

	const handlePagination = (start: number, end: number) => {
		if (start > users.length || start < 1) return;
		setRecords({ ...records, start: start, end: end >= users.length ? users.length : end });
	};

	return (
		<>
			<div className="content-wrapper">
				<div className="m-auto flex flex-col justify-center items-center w-full">
					<div className="flex wrap w-full">
						<Header />
					</div>
					<div className="bg-gray20 rounded-2xl wrap w-full p-4 ">
						<div className="justify-between sm:flex">
							<SearchInput />
							<Dropdown />
						</div>
						<UsersList users={displayUser} currentUser={currentUser} />
						<Pagination records={records} onClick={(start, end) => handlePagination(start, end)} />
					</div>
				</div>
			</div>
		</>
	);
};

export default Leaderboard;
