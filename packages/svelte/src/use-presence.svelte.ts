import { prefersReducedMotion } from "./collapsible-styles.js";

export type PresenceOptions = {
  open: () => boolean;
  animated?: () => boolean;
  forceMount?: () => boolean;
};

export type Presence = {
  readonly mounted: boolean;
  readonly present: boolean;
  readonly animated: boolean;
  onTransitionEnd: (event: TransitionEvent) => void;
};

/**
 * Tracks mount/present state so content can stay mounted while its
 * close animation runs. Must be called during component initialisation.
 */
export function createPresence(options: PresenceOptions): Presence {
  const isOpen = () => options.open();
  const isForceMount = () => options.forceMount?.() ?? false;
  const shouldAnimate = () =>
    (options.animated?.() ?? true) && !prefersReducedMotion();

  let mountedState = $state(isOpen() || isForceMount());
  let presentState = $state(isOpen());

  $effect.pre(() => {
    const open = isOpen();
    const animate = shouldAnimate();
    const forceMount = isForceMount();

    if (open) {
      mountedState = true;
      if (!animate) {
        presentState = true;
        return;
      }
      const frame = requestAnimationFrame(() => {
        presentState = true;
      });
      return () => cancelAnimationFrame(frame);
    }

    presentState = false;
    if (!animate && !forceMount) {
      mountedState = false;
    }
  });

  const onTransitionEnd = (event: TransitionEvent) => {
    if (
      event.currentTarget != null &&
      event.target !== event.currentTarget
    ) {
      return;
    }
    if (event.propertyName && event.propertyName !== "grid-template-rows") {
      return;
    }
    if (!isOpen() && !isForceMount()) {
      mountedState = false;
    }
  };

  return {
    get mounted() {
      return isForceMount() || mountedState;
    },
    get present() {
      return presentState;
    },
    get animated() {
      return shouldAnimate();
    },
    onTransitionEnd,
  };
}
