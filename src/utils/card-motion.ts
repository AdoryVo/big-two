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

/** Custom prop for center combo enter: stagger index + fly-in origin (screen-space px from rest). */
export type ComboPlayCustom = {
  index: number;
  fly: { x: number; y: number };
};

/**
 * Approximate offset from the table center toward each hand’s fixed layout slot.
 * Matches `indexToPosition` in ActiveGame: 0 bottom (you), 1 left, 2 top, 3 right.
 */
export function comboFlyOriginForSeat(
  seat: number,
  opts?: { compact?: boolean },
): { x: number; y: number } {
  const m = opts?.compact ? 0.52 : 1;
  let x = 0;
  let y = 0;
  switch (seat % 4) {
    case 0:
      y = 215;
      break;
    case 1:
      x = -295;
      y = 35;
      break;
    case 2:
      y = -225;
      break;
    case 3:
      x = 295;
      y = 35;
      break;
    default:
      y = 44;
  }
  return { x: x * m, y: y * m };
}

const defaultComboFly = { x: 0, y: 44 };

function comboPlayHidden(c: ComboPlayCustom) {
  const fly = c.fly ?? defaultComboFly;
  const tilt =
    fly.x < -80 ? 11 : fly.x > 80 ? -11 : fly.y > 80 ? -9 : fly.y < -80 ? 9 : 7;
  return {
    opacity: 0,
    scale: 0.68,
    x: fly.x,
    y: fly.y,
    rotateZ: tilt,
  };
}

function comboPlayShow(c: ComboPlayCustom) {
  const i = c.index;
  return {
    opacity: 1,
    scale: 1,
    x: 0,
    y: 0,
    rotateZ: 0,
    transition: spring(i * 0.048, 440, 26),
  };
}

/** Cards flying from the last playmaker’s hand into the center play area. */
export const comboPlayVariants: Variants = {
  hidden: (custom) =>
    comboPlayHidden(
      typeof custom === 'object' && custom !== null && 'fly' in custom
        ? (custom as ComboPlayCustom)
        : {
            index: typeof custom === 'number' ? custom : 0,
            fly: defaultComboFly,
          },
    ),
  show: (custom) =>
    comboPlayShow(
      typeof custom === 'object' && custom !== null && 'index' in custom
        ? (custom as ComboPlayCustom)
        : {
            index: typeof custom === 'number' ? custom : 0,
            fly: defaultComboFly,
          },
    ),
  exit: {
    opacity: 0,
    scale: 0.75,
    x: 0,
    y: -16,
    rotateZ: -4,
    transition: { duration: 0.2, ease: [0.4, 0, 1, 1] },
  },
};
