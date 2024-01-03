export declare global {
  export type P1RawRecord = {
    active: number;
    total: number;
    peak: number;
    peak_timestamp: number;
  };

  export type P1Record = {
    active: number;
    total: number;
    time: number;
  };
}
