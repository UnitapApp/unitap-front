import React from 'react';

import Icon from 'components/basic/Icon/Icon';

const Dropdown = () => {
  return (
    <div className="flex items-center gap-10 px-5 justify-between align-center border-gray30 border-2 bg-gray40 rounded-xl text-white mt-2 sm:mt-0 p-2">
      <p className="text-[14px]">Gas Fee Providers</p>
      <Icon
        iconSrc="assets/images/leaderboard/arrow-down.svg"
        hoverable
        // className="icon-right right-4 top-[10px] z-10"
      />
    </div>
  );
};

export default Dropdown;
