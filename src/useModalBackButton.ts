import { useEffect, useMemo, useRef } from "react";
import type { UseModalBackButtonOptions, HistoryStateShape } from "./types";

export function useModalBackButton(
  isOpen: boolean,
  onClose: () => void,
  options: UseModalBackButtonOptions = {}
) {
  const {
    key,
    enabled = true,
    pushStateOnOpen = true,
    cleanupOnClose = true
  } = options;

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
  const currentIsOpen = useRef(isOpen);
  const currentOnClose = useRef(onClose);

  useEffect(() => {
    currentIsOpen.current = isOpen;
  }, [isOpen]);

  useEffect(() => {
    currentOnClose.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!canUseBrowser || !enabled) return;

    const handlePopState = (_event: PopStateEvent) => {
      if (shouldIgnorePopState.current) {
        shouldIgnorePopState.current = false;
        return;
      }

      if (currentIsOpen.current) {
        closedByBackButton.current = true;
        currentOnClose.current();
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [canUseBrowser, enabled]);

  useEffect(() => {
    if (!canUseBrowser || !enabled) return;

    if (isOpen) {
      if (!pushStateOnOpen || hasHistoryEntry.current) {
        hasHistoryEntry.current = false;
        return;
      }

      const currentState = (history.state ?? {}) as HistoryStateShape;
      const nextState: HistoryStateShape = {
        ...currentState,
        __rmbb: { v: 1, key: modalId, ts: Date.now() }
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
}
