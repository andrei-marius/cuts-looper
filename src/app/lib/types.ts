export interface Cut {
  start: number;
  end: number;
}

export interface Loop {
  id: string;
  name: string;
  share_url: string;
  cuts: Cut[];
  created_at: string;
}
