export const MOTION_PROPS = {
    variants: {
      enter: {
        opacity: 1,
        x: 0,
      },
      exit: {
        x: 100,
        opacity: 0,
      },
    },
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  };