export type AnimationTimingFunction = "linear" | "ease-in-out";

export type CollapsibleAnimationProps = {
  /**
   * Whether expand/collapse uses the built-in height animation.
   * @default true
   */
  animated?: boolean;
  /**
   * CSS timing function for expand/collapse.
   * @default "ease-in-out"
   */
  animationTimingFunction?: AnimationTimingFunction;
  /**
   * Transition duration in milliseconds.
   * @default 200
   */
  animationDuration?: number;
  /**
   * Transition delay in milliseconds.
   * @default 0
   */
  animationDelay?: number;
};

export type ResolvedAnimationConfig = {
  animated: boolean;
  animationTimingFunction: AnimationTimingFunction;
  animationDuration: number;
  animationDelay: number;
};

export const DEFAULT_ANIMATION_DURATION_MS = 200;
export const DEFAULT_ANIMATION_DELAY_MS = 0;
export const DEFAULT_ANIMATION_TIMING_FUNCTION: AnimationTimingFunction =
  "ease-in-out";

export function resolveAnimationConfig(
  props: CollapsibleAnimationProps = {},
): ResolvedAnimationConfig {
  return {
    animated: props.animated ?? true,
    animationTimingFunction:
      props.animationTimingFunction ?? DEFAULT_ANIMATION_TIMING_FUNCTION,
    animationDuration: props.animationDuration ?? DEFAULT_ANIMATION_DURATION_MS,
    animationDelay: props.animationDelay ?? DEFAULT_ANIMATION_DELAY_MS,
  };
}

export function getCollapsibleAnimationStyle(
  config: Pick<
    ResolvedAnimationConfig,
    "animationTimingFunction" | "animationDuration" | "animationDelay"
  >,
): {
  "--collapsible-animation-duration": string;
  "--collapsible-animation-easing": AnimationTimingFunction;
  "--collapsible-animation-delay": string;
} {
  return {
    "--collapsible-animation-duration": `${config.animationDuration}ms`,
    "--collapsible-animation-easing": config.animationTimingFunction,
    "--collapsible-animation-delay": `${config.animationDelay}ms`,
  };
}

export function getCollapsibleAnimationStyleText(
  config: Pick<
    ResolvedAnimationConfig,
    "animationTimingFunction" | "animationDuration" | "animationDelay"
  >,
): string {
  const style = getCollapsibleAnimationStyle(config);
  return `--collapsible-animation-duration: ${style["--collapsible-animation-duration"]}; --collapsible-animation-easing: ${style["--collapsible-animation-easing"]}; --collapsible-animation-delay: ${style["--collapsible-animation-delay"]};`;
}
