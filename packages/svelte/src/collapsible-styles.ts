const STYLE_ID = "zealakit-collapsible-styles";

const STYLES = `
[data-slot="collapsible-content"][data-animated],
[data-slot="accordion-content"][data-animated] {
  display: grid;
  overflow: hidden;
  transition: grid-template-rows var(--collapsible-animation-duration, 200ms)
    var(--collapsible-animation-easing, ease-in-out)
    var(--collapsible-animation-delay, 0ms);
}
[data-slot="collapsible-content"][data-animated][data-state="closed"],
[data-slot="accordion-content"][data-animated][data-state="closed"] {
  /* minmax(0, …) forces a zero lower bound; bare 0fr can keep a content min size */
  grid-template-rows: minmax(0, 0fr);
}
[data-slot="collapsible-content"][data-animated][data-state="open"],
[data-slot="accordion-content"][data-animated][data-state="open"] {
  grid-template-rows: minmax(0, 1fr);
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
    transition-delay: 0s;
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
  if (
    typeof window === "undefined" ||
    typeof window.matchMedia !== "function"
  ) {
    return false;
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
