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

export type P1HistoryRecord = {
  total: number;
  peak: number;
  peakTime: number;
  time: number;
};
