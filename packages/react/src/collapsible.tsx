import { useCallback, useEffect, useId, useState, type MouseEvent } from "react";
import {
  CollapsibleContext,
  useCollapsibleContext,
} from "./collapsible-context";
import { ensureCollapsibleStyles } from "./collapsible-styles";
import type {
  CollapsibleContentProps,
  CollapsibleProps,
  CollapsibleTriggerProps,
} from "./collapsible-types";
import { usePresence } from "./use-presence";

export type {
  CollapsibleContentProps,
  CollapsibleProps,
  CollapsibleTriggerProps,
} from "./collapsible-types";

function CollapsibleRoot({
  defaultOpen = false,
  open: openProp,
  onOpenChange,
  disabled = false,
  animated = true,
  children,
  ...props
}: CollapsibleProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : uncontrolledOpen;

  const reactId = useId();
  const triggerId = `collapsible-trigger-${reactId}`;
  const contentId = `collapsible-content-${reactId}`;

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(next);
      }
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  return (
    <CollapsibleContext.Provider
      value={{ open, disabled, animated, contentId, triggerId, setOpen }}
    >
      <div
        {...props}
        data-slot="collapsible"
        data-state={open ? "open" : "closed"}
        data-disabled={disabled ? "" : undefined}
      >
        {children}
      </div>
    </CollapsibleContext.Provider>
  );
}

function CollapsibleTrigger({
  disabled: disabledProp,
  onClick,
  children,
  ...props
}: CollapsibleTriggerProps) {
  const {
    open,
    disabled: contextDisabled,
    contentId,
    triggerId,
    setOpen,
  } = useCollapsibleContext();
  const disabled = disabledProp ?? contextDisabled;

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (event.defaultPrevented || disabled) {
      return;
    }
    setOpen(!open);
  };

  return (
    <button
      type="button"
      {...props}
      id={props.id ?? triggerId}
      aria-expanded={open}
      aria-controls={contentId}
      disabled={disabled}
      data-slot="collapsible-trigger"
      data-state={open ? "open" : "closed"}
      data-disabled={disabled ? "" : undefined}
      onClick={handleClick}
    >
      {children}
    </button>
  );
}

function CollapsibleContent({
  forceMount = false,
  children,
  ...props
}: CollapsibleContentProps) {
  const { open, animated, contentId } = useCollapsibleContext();
  const presence = usePresence(open, { animated, forceMount });

  useEffect(() => {
    ensureCollapsibleStyles();
  }, []);

  if (!presence.mounted) {
    return null;
  }

  const state = presence.present ? "open" : "closed";

  return (
    <div
      {...props}
      id={props.id ?? contentId}
      data-slot="collapsible-content"
      data-state={state}
      data-animated={presence.animated ? "" : undefined}
      hidden={!presence.present && !presence.animated}
      inert={!open ? true : undefined}
      onTransitionEnd={presence.onTransitionEnd}
    >
      <div data-collapsible-content-wrapper="">{children}</div>
    </div>
  );
}

type CollapsibleComponent = typeof CollapsibleRoot & {
  Trigger: typeof CollapsibleTrigger;
  Content: typeof CollapsibleContent;
};

const Collapsible = CollapsibleRoot as CollapsibleComponent;
Collapsible.Trigger = CollapsibleTrigger;
Collapsible.Content = CollapsibleContent;

export {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
  useCollapsibleContext,
};
