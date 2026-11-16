export {
  createDisclosure,
  type CreateDisclosureOptions,
  type DisclosureController,
} from "./create-disclosure";
export type {
  AnimationConfig,
  AnimationEasing,
  AnimationSetting,
  AnimationTimingFunction,
  CollapsibleAnimationProps,
  ResolvedAnimationConfig,
} from "./animation";
export {
  DEFAULT_ANIMATION_DELAY,
  DEFAULT_ANIMATION_DELAY_MS,
  DEFAULT_ANIMATION_DURATION,
  DEFAULT_ANIMATION_DURATION_MS,
  DEFAULT_ANIMATION_EASING,
  DEFAULT_ANIMATION_TIMING_FUNCTION,
  getAnimationStyle,
  getCollapsibleAnimationStyle,
  normalizeAnimationConfig,
  resolveAnimationConfig,
} from "./animation";
export { ensureCollapsibleStyles, prefersReducedMotion } from "./styles";
