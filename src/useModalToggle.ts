import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { UseModalToggleOptions, UseModalToggleReturn, HistoryStateShape } from "./types";

export function useModalToggle(options: UseModalToggleOptions = {}): UseModalToggleReturn {
  const {
    key,
    enabled = true,
    pushStateOnOpen = true,
    cleanupOnClose = true,
    autoCloseOthersOnOpen = false
  } = options;

  const [isOpen, setIsOpen] = useState(false);

  const modalId = useMemo(
    () => key ?? `rmbb_${Math.random().toString(36).slice(2)}`,
    [key]
  );

  const canUseBrowser = useMemo(
    () => typeof window !== "undefined" && typeof history !== "undefined",
    []
  );

  const hasHistoryEntry = useRef(false);
  const shouldIgnorePopState = useRef(false);
  const closedByBackButton = useRef(false);

  const open = useCallback(() => {
    setIsOpen(true);

    if (autoCloseOthersOnOpen && canUseBrowser && enabled) {
      const event = new CustomEvent("rmbb:modal-open", {
        detail: { modalId }
      });
      window.dispatchEvent(event);
    }
  }, [autoCloseOthersOnOpen, canUseBrowser, enabled, modalId]);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    if (!canUseBrowser || !enabled) return;

    const handlePopState = (_event: PopStateEvent) => {
      if (shouldIgnorePopState.current) {
        shouldIgnorePopState.current = false;
        return;
      }

      if (!isOpen || !hasHistoryEntry.current) return;

      const currentState = (history.state ?? {}) as HistoryStateShape;
      const currentKeys = currentState.__rmbb?.keys ?? [];

      if (!currentKeys.includes(modalId)) {
        closedByBackButton.current = true;
        setIsOpen(false);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [canUseBrowser, enabled, isOpen, modalId]);

  useEffect(() => {
    if (!canUseBrowser || !enabled || !autoCloseOthersOnOpen) return;

    const handleExternalOpen = (event: Event) => {
      const custom = event as CustomEvent<{ modalId: string }>;
      if (!custom.detail) return;

      if (custom.detail.modalId !== modalId) {
        setIsOpen(false);
      }
    };

    window.addEventListener("rmbb:modal-open", handleExternalOpen);
    return () => window.removeEventListener("rmbb:modal-open", handleExternalOpen);
  }, [autoCloseOthersOnOpen, canUseBrowser, enabled, modalId]);

  useEffect(() => {
    if (!canUseBrowser || !enabled) return;

    if (isOpen) {
      if (!pushStateOnOpen || hasHistoryEntry.current) {
        hasHistoryEntry.current = false;
        return;
      }

      const currentState = (history.state ?? {}) as HistoryStateShape;
      const currentKeys = currentState.__rmbb?.keys ?? [];
      const nextState: HistoryStateShape = {
        ...currentState,
        __rmbb: { v: 1, keys: [...currentKeys, modalId], ts: Date.now() }
      };

      history.pushState(nextState, document.title);
      hasHistoryEntry.current = true;
      return;
    }

    if (cleanupOnClose && hasHistoryEntry.current) {
      hasHistoryEntry.current = false;

      if (closedByBackButton.current) {
        closedByBackButton.current = false;
        return;
      }

      shouldIgnorePopState.current = true;
      history.back();
      return;
    }

    hasHistoryEntry.current = false;
    closedByBackButton.current = false;
  }, [canUseBrowser, enabled, isOpen, pushStateOnOpen, cleanupOnClose, modalId]);

  return { isOpen, open, close, toggle };
}

