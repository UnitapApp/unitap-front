import loadingAnimation from "../lotties/loadingAnimation.json";
import chanceAnimation from "../lotties/chanceAnimation.json";

export const loadAnimationOption = {
  loop: true,
  autoplay: true,
  animationData: loadingAnimation,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

export const chanceAnimationOption = {
  loop: true,
  autoplay: true,
  animationData: chanceAnimation,
  Infinity,
  // rendererSettings: {
  //   preserveAspectRatio: "xMidYMid slice",
  // },
};
