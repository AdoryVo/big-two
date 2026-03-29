import { useEffect, useLayoutEffect, useRef, useState } from 'react';

/**
 * Per-component deal stagger. Parent passes `skipDealIntro` when this tab has
 * already seen this deal (sessionStorage), so refresh does not replay. Do not
 * write sessionStorage here — multiple hook instances share one game and a
 * short timer from an empty hand would mark the whole deal "seen" too early.
 */
export function useHandDealIntro(
  skipDealIntro: boolean,
  dealStamp: string,
  handLength: number,
) {
  // Framer Motion only applies `initial` on first mount. If the first commit
  // used initial={false}, later setPlayIntro(true) is an update and does not
  // replay the entrance — so start true whenever this hook instance should run
  // the deal intro (parent remounts per dealStamp when the stamp changes).
  const [playIntro, setPlayIntro] = useState(
    () => !skipDealIntro && Boolean(dealStamp),
  );
  const introConsumedRef = useRef<string | null>(null);
  const prevLenRef = useRef<number | null>(null);

  useLayoutEffect(() => {
    if (skipDealIntro) {
      setPlayIntro(false);
      prevLenRef.current = handLength;
      return;
    }
    if (
      dealStamp &&
      prevLenRef.current !== null &&
      prevLenRef.current > 0 &&
      handLength < prevLenRef.current
    ) {
      introConsumedRef.current = dealStamp;
      setPlayIntro(false);
      prevLenRef.current = handLength;
      return;
    }
    prevLenRef.current = handLength;

    if (!dealStamp || introConsumedRef.current === dealStamp) {
      setPlayIntro(false);
      return;
    }
    // Before paint: Framer Motion only respects `initial` on first mount; if the
    // first commit used initial={false}, switching in useEffect is too late.
    setPlayIntro(true);
  }, [skipDealIntro, dealStamp, handLength]);

  useEffect(() => {
    if (skipDealIntro || !dealStamp || introConsumedRef.current === dealStamp) {
      return;
    }

    const ms = Math.min(1100, 120 + Math.max(handLength, 1) * 42);
    const t = window.setTimeout(() => {
      introConsumedRef.current = dealStamp;
      setPlayIntro(false);
    }, ms);
    return () => window.clearTimeout(t);
  }, [skipDealIntro, dealStamp, handLength]);

  return playIntro;
}
