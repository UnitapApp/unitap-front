import Styles from "./provider-dashboard.module.scss"

const Header = () => {
  return (
    <div
      className={
        Styles.header +
        " bg-no-repeat bg-cover border-3 rounded-3xl border-gray40 w-full h-[202px] flex items-center overflow-hidden p-5 mb-4"
      }
    >
      <div className="items-center h-auto">
        <img
          className="h-auto w-375 mb-3"
          src="/assets/images/provider-dashboard/blibk neon.png"
        />
        <p className="z-10 text-sm text-gray100 text-[12px] max-w-[365px]">
          Here you can see your history of your previous provides and you can
          provide more ;)
        </p>
      </div>
    </div>
  )
}

export default Header
