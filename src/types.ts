export type UseModalBackButtonOptions = {
  key?: string;
  enabled?: boolean;
  pushStateOnOpen?: boolean;
  cleanupOnClose?: boolean;
};

export type UseModalBackButtonReturn = {
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

