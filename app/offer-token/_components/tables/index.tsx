import Image from "next/image";
import BuyingOrders from "./buying-orders";
import SellingOrders from "./selling-orders";

const Tables = () => {
  return (
    <div className="background-dashboard rounded-4xl h-full overflow-hidden border-2 border-gray60 py-2">
      <h3 className="my-3 pl-5 font-semibold text-gray100">Order Book</h3>

      <SellingOrders />
      <div className="my-2 flex gap-5 bg-gray30 px-5 py-3 font-semibold text-space-green">
        <span>0.059132</span>

        <Image
          src="/assets/images/offer-token/up-arrow.svg"
          width={13}
          height={18}
          alt="up-arrow"
        />
      </div>
      <BuyingOrders />
    </div>
  );
};
export default Tables;
