export type UseModalToggleOptions = {
  key?: string;
  enabled?: boolean;
  pushStateOnOpen?: boolean;
  cleanupOnClose?: boolean;
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
    key: string;
    ts: number;
  };
};

