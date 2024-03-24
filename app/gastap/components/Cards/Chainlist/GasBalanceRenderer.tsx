import { FC } from "react";

const GasBalanceRenderer: FC<{ balance: number }> = ({ balance }) => {
  if (balance > 1) {
    return (
      <div className="flex items-center ml-3 gap-2">
        {Array.from(new Array(balance)).map((_, key) => (
          <span className="w-3 h-1 rounded-[2px] bg-space-green" key={key} />
        ))}
        {Array.from(new Array(5 - balance)).map((_, key) => (
          <span className="w-3 h-1 rounded-[2px] bg-gray60" key={key} />
        ))}
      </div>
    );
  }

  if (balance == 1)
    return (
      <div className="flex items-center ml-3 gap-2">
        {Array.from(new Array(balance)).map((_, key) => (
          <span className="w-3 h-1 rounded-[2px] bg-yellow-600" key={key} />
        ))}
        {Array.from(new Array(5 - balance)).map((_, key) => (
          <span className="w-3 h-1 rounded-[2px] bg-gray60" key={key} />
        ))}
      </div>
    );

  return (
    <div className="flex items-center ml-3 gap-2">
      {Array.from(new Array(5)).map((_, key) => (
        <span
          className="w-3 h-[5px] rounded-[8px] border-[1px] bg-gray60 border-error"
          key={key}
        />
      ))}
    </div>
  );
};

export default GasBalanceRenderer;
