import BalanceRenderer from "./balance-renderer";
import CurrencySelect from "./currency-select";

const Header = () => {
  return (
    <header className="grid grid-cols-9 gap-4">
      <div className="col-span-5">
        <CurrencySelect />
      </div>
      <div className="col-span-4">
        <BalanceRenderer />
      </div>
    </header>
  );
};

export default Header;
