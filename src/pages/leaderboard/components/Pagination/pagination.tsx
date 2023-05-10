import React from 'react';
import Icon from 'components/basic/Icon/Icon';

interface Props {
  records: { start: number; end: number };
  onClick: (start: number, end: number) => void;
}

const Pagination = ({ records, onClick }: Props) => {
  return (
    <div className="flex justify-center items-center ">
      <div className="flex gap-5 text-white items-center align-center mt-4">
        <Icon
          iconSrc="assets/images/leaderboard/arrow-left.svg"
          width="8px"
          height="14px"
          hoverable
          onClick={() => onClick(records.start - 10, records.start - 1)}
        />
        <p className="text-[14px]">
          [{records.start}-{records.end}]
        </p>
        <Icon
          iconSrc="assets/images/leaderboard/arrow-right.svg"
          width="8px"
          height="14px"
          hoverable
          onClick={() => onClick(records.start + 10, records.end + 10)}
        />
      </div>
    </div>
  );
};

export default Pagination;
