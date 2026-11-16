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

// ── Deprecated legacy API (removed in 2.0.0) ─────────────────────────────────

/** @deprecated Use `AnimationConfig` through the `animation` option. */
export type CollapsibleAnimationProps = {
  /**
   * Whether expand/collapse uses the built-in height animation.
   * @default true
   * @deprecated Use `animation={false}` or `animation={{ enabled }}`.
   */
  animated?: boolean;
  /**
   * CSS timing function for expand/collapse.
   * @default "ease-in-out"
   * @deprecated Use `animation={{ easing }}`.
   */
  animationTimingFunction?: AnimationTimingFunction;
  /**
   * Transition duration in milliseconds.
   * @default 200
   * @deprecated Use `animation={{ duration }}`.
   */
  animationDuration?: number;
  /**
   * Transition delay in milliseconds.
   * @default 0
   * @deprecated Use `animation={{ delay }}`.
   */
  animationDelay?: number;
};

/** @deprecated Use `ResolvedAnimationConfig`. */
export type LegacyResolvedAnimationConfig = {
  animated: boolean;
  animationTimingFunction: AnimationTimingFunction;
  animationDuration: number;
  animationDelay: number;
};

/** @deprecated Use `DEFAULT_ANIMATION_DURATION`. */
export const DEFAULT_ANIMATION_DURATION_MS = DEFAULT_ANIMATION_DURATION;
/** @deprecated Use `DEFAULT_ANIMATION_DELAY`. */
export const DEFAULT_ANIMATION_DELAY_MS = DEFAULT_ANIMATION_DELAY;
/** @deprecated Use `DEFAULT_ANIMATION_EASING`. */
export const DEFAULT_ANIMATION_TIMING_FUNCTION: AnimationTimingFunction =
  "ease-in-out";

/** Maps the four legacy props to an `AnimationConfig`, or `undefined` when none is set. */
export function fromLegacyProps(
  props: CollapsibleAnimationProps,
): AnimationConfig | undefined {
  if (
    props.animated === undefined &&
    props.animationDuration === undefined &&
    props.animationDelay === undefined &&
    props.animationTimingFunction === undefined
  ) {
    return undefined;
  }
  return {
    enabled: props.animated,
    duration: props.animationDuration,
    delay: props.animationDelay,
    easing: props.animationTimingFunction,
  };
}

const warnedLegacyProps = new Set<string>();

// Module-scoped declaration so builds do not need Node typings. Bundlers replace
// `process.env.NODE_ENV`; where `process` is absent the access throws and we warn.
declare const process: { env: { NODE_ENV?: string } };

function isDevelopment(): boolean {
  try {
    return process.env.NODE_ENV !== "production";
  } catch {
    return true;
  }
}

/** Warns once per legacy prop name, in development only. */
export function warnLegacyAnimationProp(name: string, replacement: string) {
  if (warnedLegacyProps.has(name) || !isDevelopment()) {
    return;
  }
  warnedLegacyProps.add(name);
  console.warn(
    `[disclosure] \`${name}\` is deprecated and will be removed in 2.0.0. Use \`${replacement}\` instead.`,
  );
}

const LEGACY_REPLACEMENTS = {
  animated: "animation={false}",
  animationDuration: "animation={{ duration }}",
  animationDelay: "animation={{ delay }}",
  animationTimingFunction: "animation={{ easing }}",
} as const;

/**
 * Resolves the `animation` option together with the deprecated legacy props.
 * `animation` wins; legacy props are ignored when it is present.
 */
export function resolveAnimationSetting(
  props: CollapsibleAnimationProps & { animation?: AnimationSetting },
): ResolvedAnimationConfig {
  if (props.animation !== undefined) {
    return normalizeAnimationConfig(props.animation);
  }
  for (const name of Object.keys(LEGACY_REPLACEMENTS) as Array<
    keyof typeof LEGACY_REPLACEMENTS
  >) {
    if (props[name] !== undefined) {
      warnLegacyAnimationProp(name, LEGACY_REPLACEMENTS[name]);
    }
  }
  return normalizeAnimationConfig(fromLegacyProps(props));
}

/** @deprecated Use `normalizeAnimationConfig`. */
export function resolveAnimationConfig(
  props: CollapsibleAnimationProps = {},
): LegacyResolvedAnimationConfig {
  const resolved = normalizeAnimationConfig(fromLegacyProps(props));
  return {
    animated: resolved.enabled,
    animationTimingFunction: resolved.easing as AnimationTimingFunction,
    animationDuration: resolved.duration,
    animationDelay: resolved.delay,
  };
}

/** @deprecated Use `getAnimationStyle`. */
export function getCollapsibleAnimationStyle(
  config: Pick<
    LegacyResolvedAnimationConfig,
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
