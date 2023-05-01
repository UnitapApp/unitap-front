import React, { useState } from 'react';
import Navbar from 'components/common/Navbar/navbar';
import Header from './components/Header/header';
import SearchInput from './components/SearchInput/searchInput';
import Dropdown from './components/Dropdown/dropdown';
import Pagination from './components/Pagination/pagination';
import UsersList from './components/UsersList/usersList';
import { users } from 'constants/usersList';

const Leaderboard = () => {
  return (
    <>
      <Navbar />
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
            <UsersList users={users} />
            <Pagination />
          </div>
        </div>
      </div>
    </>
  );
};

export default Leaderboard;
