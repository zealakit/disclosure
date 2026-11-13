import {
  useEffect,
  useLayoutEffect,
  useState,
  type TransitionEvent,
} from "react";
import { prefersReducedMotion } from "./collapsible-styles";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export type PresenceState = {
  mounted: boolean;
  present: boolean;
  animated: boolean;
};

export function usePresence(
  open: boolean,
  options: {
    animated?: boolean;
    forceMount?: boolean;
  } = {},
): PresenceState & {
  onTransitionEnd: (event: TransitionEvent<HTMLElement>) => void;
} {
  const animatedProp = options.animated ?? true;
  const forceMount = options.forceMount ?? false;
  const shouldAnimate = animatedProp && !prefersReducedMotion();

  const [mounted, setMounted] = useState(() => open || forceMount);
  const [present, setPresent] = useState(open);

  useIsomorphicLayoutEffect(() => {
    if (open) {
      setMounted(true);
      if (!shouldAnimate) {
        setPresent(true);
        return;
      }
      const frame = requestAnimationFrame(() => {
        setPresent(true);
      });
      return () => cancelAnimationFrame(frame);
    }

    setPresent(false);

    if (!shouldAnimate || forceMount) {
      if (!forceMount) {
        setMounted(false);
      }
    }
  }, [open, shouldAnimate, forceMount]);

  const onTransitionEnd = (event: TransitionEvent<HTMLElement>) => {
    if (event.currentTarget != null && event.target !== event.currentTarget) {
      return;
    }
    if (event.propertyName && event.propertyName !== "grid-template-rows") {
      return;
    }
    if (!open && !forceMount) {
      setMounted(false);
    }
  };

  return {
    mounted: forceMount || mounted,
    present,
    animated: shouldAnimate,
    onTransitionEnd,
  };
}
