import {
  getAnimationStyle,
  type ResolvedAnimationConfig,
} from "./animation.js";

/** Serializes the animation CSS variables into an inline `style` string. */
export function getAnimationStyleText(config: ResolvedAnimationConfig): string {
  return Object.entries(getAnimationStyle(config))
    .map(([name, value]) => `${name}: ${value};`)
    .join(" ");
}
