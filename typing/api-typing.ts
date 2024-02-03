export interface Item {
  index: number;
  title: string;
  durationSec: number;
}

export interface Result {
  author: string;
  title: string;
  items: Item[];
}

export interface WebResponse {
  support: boolean;
  data: Result | null;
}
