import UButton from "@/components/ui/Button/UButton";

const learnTap = {
  name: "Learn Tap",
  icon: "learntap-icon.png",
  description: "Explore communities, learn about them and earn rewards.",
  class: "bg-learntap-texture",
  iconSize: "w-6",
};

const LearnTapLanding = () => {
  return (
    <section className="rounded-2xl p-[1px]" id="learntap">
      <div className="uni-card relative z-20 flex h-40 flex-col justify-between bg-learntap-texture bg-cover">
        <section className="h-full flex-col items-center justify-center p-4 sm:flex">
          <header className={`flex h-10 items-center justify-between gap-4`}>
            <div
              className={`flex flex-auto items-center gap-3 sm:justify-center`}
            >
              <p className={"text-xl font-semibold text-white"}>
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
                className={`secondary-button text-gradient-primary !bg-gray30 text-white sm:absolute sm:right-4 sm:top-4`}
                size={"btn-small"}
              >
                Soon...
              </UButton>
            </div>
          </header>
          <p
            className={
              "py-4 text-center text-xs font-normal leading-loose text-secondary-text"
            }
          >
            {learnTap.description}
          </p>
        </section>
      </div>
    </section>
  );
};

export default LearnTapLanding;
