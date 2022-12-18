import React from "react";

import Icon from "components/basic/Icon/Icon";

interface ChainItemProps {
  icon: string;
  title: string;
  selected?: boolean;
  onClick: () => void;
  "data-testid"?: string;
}

const ChainItem = (props: ChainItemProps) => {
  const { title, selected, icon, onClick } = props;
  return (
    <div className="bg-gray30 rounded-xl border-2 border-gray50 flex p-4 pl-3 items-center mt-3 cursor-pointer" onClick={onClick} data-testid={props["data-testid"]}>
      <Icon mr={2} width="32px" iconSrc={icon}></Icon>
      <p className="token-symbol text-white font-semibold mr-auto">{title}</p>
      <p className="balance mr-2 text-gray90 text-xs">Contract Balance: </p>
      <p className="balance-amount text-white text-xs">20.37</p>
      {selected && <Icon iconSrc="assets/images/modal/check.svg" width="13px" height="auto" mr={2} />}
    </div>
  );
};

export default ChainItem;
