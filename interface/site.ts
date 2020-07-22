import { ILatency } from './latency';

export interface ISite {
  id?: number;
  name: string;
  url: string;
  latencies?: Array<ILatency>;
}
