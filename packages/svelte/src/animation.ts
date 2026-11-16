// ── shared with @zealakit/overlay (keep in sync, see plans/01-animation-config.md §7) ──

/** Built-in timing presets. */
export type AnimationTimingFunction = "ease-in-out" | "linear";

/** Presets plus any valid CSS timing function (for example `cubic-bezier(...)`). */
export type AnimationEasing =
  | AnimationTimingFunction
  | "ease"
  | "ease-in"
  | "ease-out"
  | (string & {});

export type AnimationConfig = {
  /** Defaults to true when a config object is passed. */
  enabled?: boolean;
  /** Milliseconds. Defaults to 200. */
  duration?: number;
  /** Milliseconds. Defaults to 0. */
  delay?: number;
  /** CSS timing function. Defaults to "ease-in-out". */
  easing?: AnimationEasing;
};

/** Animation is enabled unless `false` or `{ enabled: false }` is passed. */
export type AnimationSetting = boolean | AnimationConfig;

export type ResolvedAnimationConfig = {
  enabled: boolean;
  duration: number;
  delay: number;
  easing: AnimationEasing;
};

// ── end shared ───────────────────────────────────────────────────────────────

export const DEFAULT_ANIMATION_DURATION = 200;
export const DEFAULT_ANIMATION_DELAY = 0;
export const DEFAULT_ANIMATION_EASING: AnimationEasing = "ease-in-out";

/**
 * Resolves an `animation` setting into concrete values.
 * Invalid numbers pass through unchanged (no validation).
 */
export function normalizeAnimationConfig(
  setting: AnimationSetting | undefined,
): ResolvedAnimationConfig {
  const config: AnimationConfig =
    typeof setting === "boolean" ? { enabled: setting } : (setting ?? {});
  return {
    enabled: config.enabled ?? true,
    duration: config.duration ?? DEFAULT_ANIMATION_DURATION,
    delay: config.delay ?? DEFAULT_ANIMATION_DELAY,
    easing: config.easing ?? DEFAULT_ANIMATION_EASING,
  };
}

/** CSS variables consumed by the injected stylesheet. */
export function getAnimationStyle(
  config: ResolvedAnimationConfig,
): Record<string, string> {
  return {
    "--collapsible-animation-duration": `${config.duration}ms`,
    "--collapsible-animation-easing": config.easing,
    "--collapsible-animation-delay": `${config.delay}ms`,
  };
}
