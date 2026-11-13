const STYLE_ID = "zealakit-collapsible-styles";

const STYLES = `
[data-slot="collapsible-content"][data-animated],
[data-slot="accordion-content"][data-animated] {
  display: grid;
  transition: grid-template-rows var(--collapsible-animation-duration, 200ms)
    var(--collapsible-animation-easing, ease);
}
[data-slot="collapsible-content"][data-animated][data-state="closed"],
[data-slot="accordion-content"][data-animated][data-state="closed"] {
  grid-template-rows: 0fr;
}
[data-slot="collapsible-content"][data-animated][data-state="open"],
[data-slot="accordion-content"][data-animated][data-state="open"] {
  grid-template-rows: 1fr;
}
[data-slot="collapsible-content"][data-animated] > [data-collapsible-content-wrapper],
[data-slot="accordion-content"][data-animated] > [data-collapsible-content-wrapper] {
  overflow: hidden;
  min-height: 0;
}
@media (prefers-reduced-motion: reduce) {
  [data-slot="collapsible-content"][data-animated],
  [data-slot="accordion-content"][data-animated] {
    transition-duration: 0s;
  }
}
`;

export function ensureCollapsibleStyles(): void {
  if (typeof document === "undefined") {
    return;
  }
  if (document.getElementById(STYLE_ID)) {
    return;
  }
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = STYLES;
  document.head.appendChild(style);
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
