export type TeslaRecord = {
  name?: string;
  version?: string;
  battery?: number;
  distance?: number;
  time: number;
  wake: boolean;
  woken: boolean;
};
