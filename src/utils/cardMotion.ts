import type { Variants } from 'framer-motion';

const spring = (delay: number, stiffness: number, damping: number) => ({
  type: 'spring' as const,
  stiffness,
  damping,
  delay,
});

/** Cards flying into the hand after a deal (staggered from below). */
export const handDealVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.38,
    y: 72,
    rotateZ: -14,
  },
  show: (i: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    rotateZ: 0,
    transition: spring(i * 0.038, 440, 24),
  }),
};

/** Opponent backs: quicker, subtler fan-in. */
export const opponentDealVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.55,
    y: 20,
  },
  show: (i: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: spring(i * 0.032, 520, 28),
  }),
};

/** Cards landing in the center play area. */
export const comboPlayVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.65,
    y: 36,
    rotateZ: 6,
  },
  show: (i: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    rotateZ: 0,
    transition: spring(i * 0.05, 480, 26),
  }),
  exit: {
    opacity: 0,
    scale: 0.75,
    y: -16,
    rotateZ: -4,
    transition: { duration: 0.2, ease: [0.4, 0, 1, 1] },
  },
};
