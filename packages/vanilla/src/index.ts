export {
  createDisclosure,
  type CreateDisclosureOptions,
  type DisclosureController,
} from "./create-disclosure";
export type {
  AnimationTimingFunction,
  CollapsibleAnimationProps,
  ResolvedAnimationConfig,
} from "./animation";
export {
  DEFAULT_ANIMATION_DELAY_MS,
  DEFAULT_ANIMATION_DURATION_MS,
  DEFAULT_ANIMATION_TIMING_FUNCTION,
  getCollapsibleAnimationStyle,
  resolveAnimationConfig,
} from "./animation";
export { ensureCollapsibleStyles, prefersReducedMotion } from "./styles";
