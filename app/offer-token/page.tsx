import Header from "./_components/header";
import OrderPlace from "./_components/order-place";
import Tables from "./_components/tables";
import TradingViewWidget from "./_components/trading-view-widget";
import "./styles.scss";

const OfferTokenPage = () => {
  return (
    <div className="p-3">
      <div className="grid h-screen w-full grid-cols-12 gap-4 overflow-y-auto bg-gray10 pt-10">
        <div className="col-span-3">
          <OrderPlace />
        </div>
        <div className="col-span-9">
          <Header />

          <main className="mt-5 grid grid-cols-9 gap-4">
            <div className="col-span-3">
              <Tables />
            </div>

            <div className="col-span-6">
              <TradingViewWidget symbol="ETH" />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default OfferTokenPage;
