import loadingAnimation from "../lotties/loadingAnimation.json";
import chanceAnimation from "../lotties/chanceAnimation.json";
import arrowAnimation from "../lotties/arrowAnimation.json";

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
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

export const arrowAnimationOption = {
  loop: true,
  autoplay: true,
  animationData: arrowAnimation,
  Infinity,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};
