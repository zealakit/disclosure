import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import {
  AccordionContext,
  AccordionItemContext,
  useAccordionContext,
  useAccordionItemContext,
} from "./accordion-context";
import type {
  AccordionContentProps,
  AccordionItemProps,
  AccordionMultipleProps,
  AccordionProps,
  AccordionSingleProps,
  AccordionTriggerProps,
} from "./accordion-types";
import { ensureCollapsibleStyles } from "./collapsible-styles";
import { usePresence } from "./use-presence";

export type {
  AccordionContentProps,
  AccordionItemProps,
  AccordionMultipleProps,
  AccordionProps,
  AccordionSingleProps,
  AccordionTriggerProps,
} from "./accordion-types";

function AccordionRoot(props: AccordionProps) {
  const type = props.type ?? "single";
  const animated = props.animated ?? true;
  const disabled = props.disabled ?? false;
  const collapsible =
    type === "single"
      ? ((props as AccordionSingleProps).collapsible ?? false)
      : false;

  const [uncontrolledSingle, setUncontrolledSingle] = useState<string | null>(
    () =>
      type === "single"
        ? ((props as AccordionSingleProps).defaultValue ?? null)
        : null,
  );
  const [uncontrolledMultiple, setUncontrolledMultiple] = useState<string[]>(
    () =>
      type === "multiple"
        ? [...((props as AccordionMultipleProps).defaultValue ?? [])]
        : [],
  );

  const triggersRef = useRef(new Map<string, HTMLButtonElement>());
  const enabledOrderRef = useRef<string[]>([]);

  const singleProps = props as AccordionSingleProps;
  const multipleProps = props as AccordionMultipleProps;

  const isSingleControlled =
    type === "single" && singleProps.value !== undefined;
  const isMultipleControlled =
    type === "multiple" && multipleProps.value !== undefined;

  const singleValue = isSingleControlled
    ? (singleProps.value ?? null)
    : uncontrolledSingle;
  const multipleValue = isMultipleControlled
    ? [...(multipleProps.value ?? [])]
    : uncontrolledMultiple;

  const isItemOpen = useCallback(
    (itemValue: string) => {
      if (type === "multiple") {
        return multipleValue.includes(itemValue);
      }
      return singleValue === itemValue;
    },
    [type, multipleValue, singleValue],
  );

  const toggleItem = useCallback(
    (itemValue: string) => {
      if (disabled) {
        return;
      }

      if (type === "multiple") {
        const exists = multipleValue.includes(itemValue);
        const next = exists
          ? multipleValue.filter((value) => value !== itemValue)
          : [...multipleValue, itemValue];
        if (!isMultipleControlled) {
          setUncontrolledMultiple(next);
        }
        multipleProps.onValueChange?.(next);
        return;
      }

      const isOpen = singleValue === itemValue;
      const next = isOpen ? (collapsible ? null : singleValue) : itemValue;
      if (next === singleValue) {
        return;
      }
      if (!isSingleControlled) {
        setUncontrolledSingle(next);
      }
      singleProps.onValueChange?.(next);
    },
    [
      disabled,
      type,
      multipleValue,
      singleValue,
      collapsible,
      isMultipleControlled,
      isSingleControlled,
      multipleProps,
      singleProps,
    ],
  );

  const registerTrigger = useCallback(
    (itemValue: string, node: HTMLButtonElement | null) => {
      if (node) {
        triggersRef.current.set(itemValue, node);
        if (!enabledOrderRef.current.includes(itemValue)) {
          enabledOrderRef.current.push(itemValue);
        }
      } else {
        triggersRef.current.delete(itemValue);
        enabledOrderRef.current = enabledOrderRef.current.filter(
          (value) => value !== itemValue,
        );
      }
    },
    [],
  );

  const getEnabledTriggerValues = useCallback(() => {
    return enabledOrderRef.current.filter((value) => {
      const node = triggersRef.current.get(value);
      return Boolean(node && !node.disabled);
    });
  }, []);

  const focusTrigger = useCallback((itemValue: string) => {
    triggersRef.current.get(itemValue)?.focus();
  }, []);

  const contextValue = useMemo(
    () => ({
      type,
      animated,
      disabled,
      collapsible,
      isItemOpen,
      toggleItem,
      registerTrigger,
      getEnabledTriggerValues,
      focusTrigger,
    }),
    [
      type,
      animated,
      disabled,
      collapsible,
      isItemOpen,
      toggleItem,
      registerTrigger,
      getEnabledTriggerValues,
      focusTrigger,
    ],
  );

  const {
    type: _type,
    value: _value,
    defaultValue: _defaultValue,
    onValueChange: _onValueChange,
    animated: _animated,
    disabled: _disabled,
    children,
    ...rest
  } = props;
  const { collapsible: _collapsible, ...domProps } = rest as typeof rest & {
    collapsible?: boolean;
  };

  return (
    <AccordionContext.Provider value={contextValue}>
      <div
        {...domProps}
        data-slot="accordion"
        data-orientation="vertical"
        data-disabled={disabled ? "" : undefined}
      >
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

function AccordionItem({
  value,
  disabled: disabledProp,
  children,
  ...props
}: AccordionItemProps) {
  const accordion = useAccordionContext();
  const open = accordion.isItemOpen(value);
  const disabled = Boolean(accordion.disabled || disabledProp);
  const reactId = useId();
  const triggerId = `accordion-trigger-${reactId}`;
  const contentId = `accordion-content-${reactId}`;
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  return (
    <AccordionItemContext.Provider
      value={{ value, open, disabled, contentId, triggerId, triggerRef }}
    >
      <div
        {...props}
        data-slot="accordion-item"
        data-state={open ? "open" : "closed"}
        data-disabled={disabled ? "" : undefined}
      >
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
}

function AccordionTrigger({
  disabled: disabledProp,
  onClick,
  onKeyDown,
  children,
  ...props
}: AccordionTriggerProps) {
  const accordion = useAccordionContext();
  const item = useAccordionItemContext();
  const disabled = disabledProp ?? item.disabled;

  const setTriggerRef = useCallback(
    (node: HTMLButtonElement | null) => {
      item.triggerRef.current = node;
      accordion.registerTrigger(item.value, disabled ? null : node);
    },
    [accordion, item.triggerRef, item.value, disabled],
  );

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (event.defaultPrevented || disabled) {
      return;
    }
    accordion.toggleItem(item.value);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented || disabled) {
      return;
    }

    const enabled = accordion.getEnabledTriggerValues();
    const currentIndex = enabled.indexOf(item.value);
    if (currentIndex === -1 || enabled.length === 0) {
      return;
    }

    const focusAt = (index: number) => {
      const next = enabled[index];
      if (next) {
        event.preventDefault();
        accordion.focusTrigger(next);
      }
    };

    switch (event.key) {
      case "ArrowDown":
        focusAt((currentIndex + 1) % enabled.length);
        break;
      case "ArrowUp":
        focusAt((currentIndex - 1 + enabled.length) % enabled.length);
        break;
      case "Home":
        focusAt(0);
        break;
      case "End":
        focusAt(enabled.length - 1);
        break;
      default:
        break;
    }
  };

  return (
    <h3 data-slot="accordion-heading">
      <button
        type="button"
        {...props}
        ref={setTriggerRef}
        id={props.id ?? item.triggerId}
        aria-expanded={item.open}
        aria-controls={item.contentId}
        disabled={disabled}
        data-slot="accordion-trigger"
        data-state={item.open ? "open" : "closed"}
        data-disabled={disabled ? "" : undefined}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
      >
        {children}
      </button>
    </h3>
  );
}

function AccordionContent({
  forceMount = false,
  children,
  ...props
}: AccordionContentProps) {
  const accordion = useAccordionContext();
  const item = useAccordionItemContext();
  const presence = usePresence(item.open, {
    animated: accordion.animated,
    forceMount,
  });

  useEffect(() => {
    ensureCollapsibleStyles();
  }, []);

  if (!presence.mounted) {
    return null;
  }

  const state = presence.present ? "open" : "closed";

  return (
    <section
      {...props}
      id={props.id ?? item.contentId}
      aria-labelledby={item.triggerId}
      data-slot="accordion-content"
      data-state={state}
      data-animated={presence.animated ? "" : undefined}
      hidden={!presence.present && !presence.animated}
      inert={!item.open ? true : undefined}
      onTransitionEnd={presence.onTransitionEnd}
    >
      <div data-collapsible-content-wrapper="">{children}</div>
    </section>
  );
}

type AccordionComponent = typeof AccordionRoot & {
  Item: typeof AccordionItem;
  Trigger: typeof AccordionTrigger;
  Content: typeof AccordionContent;
};

const Accordion = AccordionRoot as AccordionComponent;
Accordion.Item = AccordionItem;
Accordion.Trigger = AccordionTrigger;
Accordion.Content = AccordionContent;

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
