import React from 'react';
import Icon from 'components/basic/Icon/Icon';

const Pagination = () => {
  return (
    <div className="flex justify-center items-center ">
      <div className="flex gap-5 text-white items-center align-center mt-4">
        <Icon iconSrc="assets/images/leaderboard/arrow-left.svg" width="8px" height="14px" hoverable />
        <p className="text-[14px]">[1-10]</p>
        <Icon iconSrc="assets/images/leaderboard/arrow-right.svg" width="8px" height="14px" hoverable />
      </div>
    </div>
  );
};

export default Pagination;
