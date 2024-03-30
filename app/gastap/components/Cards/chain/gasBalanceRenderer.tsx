import { FC } from "react";

import "@/app/gastap/styles.scss";

const GasBalanceRenderer: FC<{ balance: number }> = ({ balance }) => {
  if (balance > 6) {
    return (
      <div className="ml-3 flex items-center gap-[2px]">
        {Array.from(new Array(balance)).map((_, key) => (
          <span className="gas-level-fine h-4 w-1" key={key} />
        ))}
        {Array.from(new Array(10 - balance)).map((_, key) => (
          <span className="h-4 w-1 bg-[#13131A]" key={key} />
        ))}
      </div>
    );
  }

  if (balance >= 4)
    return (
      <div className="ml-3 flex items-center gap-[2px]">
        {Array.from(new Array(balance)).map((_, key) => (
          <span className="gas-level-low h-4 w-1" key={key} />
        ))}
        {Array.from(new Array(10 - balance)).map((_, key) => (
          <span className="h-4 w-1 bg-[#13131A]" key={key} />
        ))}
      </div>
    );

  return (
    <div className="ml-3 flex items-center gap-[2px]">
      {Array.from(new Array(balance)).map((_, key) => (
        <span className="gas-level-empty h-4 w-1" key={key} />
      ))}

      {Array.from(new Array(10 - balance)).map((_, key) => (
        <span className="h-4 w-1 bg-[#13131A]" key={key} />
      ))}
    </div>
  );
};

export default GasBalanceRenderer;
