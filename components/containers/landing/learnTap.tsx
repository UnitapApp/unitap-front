import UButton from "@/components/ui/Button/UButton"

const learnTap = {
  name: "Learn Tap",
  icon: "learntap-icon.png",
  description: "Where users can learn to use web3 technologies",
  class: "bg-learntap-texture",
  iconSize: "w-6",
}

const LearnTapLanding = () => {
  return (
    <section id="learn-tap">
      <div className="flex flex-col justify-between uni-card bg-learntap-texture bg-cover h-40">
        <section className="sm:flex items-center justify-center flex-col p-4 h-full">
          <header className={`flex gap-4 items-center justify-between h-10`}>
            <div
              className={`flex gap-3 sm:justify-center items-center flex-auto`}
            >
              <p className={"text-white text-xl font-semibold"}>
                {learnTap.name}
              </p>
              <img
                className={`${learnTap.iconSize} widget-icon`}
                src={`/assets/images/landing/${learnTap.icon}`}
                alt={"widget"}
              />
            </div>
            <div>
              <UButton
                unClickable
                className={`secondary-button sm:absolute sm:top-4 sm:right-4 !bg-gray30 text-gradient-primary text-white`}
                size={"btn-small"}
              >
                Soon...
              </UButton>
            </div>
          </header>
          <p
            className={
              "text-secondary-text text-center text-xs leading-loose font-normal py-4"
            }
          >
            {learnTap.description}
          </p>
        </section>
      </div>
    </section>
  )
}

export default LearnTapLanding
