import Styles from "./provider-dashboard.module.scss";

const Header = () => {
  return (
    <div
      className={
        Styles.header +
        " mb-4 flex h-[202px] w-full items-center overflow-hidden rounded-3xl border-3 border-gray40 bg-cover bg-no-repeat p-5"
      }
    >
      <div className="h-auto items-center">
        <img
          className="w-375 mb-3 h-auto"
          src="/assets/images/provider-dashboard/blibk neon_.svg"
        />
        <p className="z-10 max-w-[365px] text-xs text-gray100">
          Build your own incentive program using Unitap{"'"}s production-ready
          tools
        </p>
      </div>
    </div>
  );
};

export default Header;
