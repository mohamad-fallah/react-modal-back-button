export type UseModalToggleOptions = {
  key?: string;
  enabled?: boolean;
  pushStateOnOpen?: boolean;
  cleanupOnClose?: boolean;
  /**
   * When true, ensures that only one modal using this hook with
   * this flag enabled is open at a time. Opening a new modal will
   * automatically close any other open modals that also have this
   * flag enabled.
   */
  autoCloseOthersOnOpen?: boolean;
};

export type UseModalToggleReturn = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
};

export type HistoryStateShape = {
  __rmbb?: {
    v: 1;
    keys: string[];
    ts: number;
  };
};

