import React from 'react';

const Header = () => {
  return (
    <div className="header w-full h-[152px] bg-gray20 rounded-2xl flex justify-between items-end overflow-hidden p-4 mb-4">
      <div className="header__left items-center h-auto">
        <img className="gas-tap h-auto w-40 mb-3" src="assets/images/leaderboard/leaderboard-header.png" />
      </div>
    </div>
  );
};

export default Header;
