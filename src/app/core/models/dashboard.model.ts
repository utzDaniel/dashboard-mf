export interface PayrollSummaryResponse {
  competenceInitial: string;
  competenceEnd: string;
  entry: EntryTypeResponse[];
}

export interface EntryTypeResponse {
  id: number;
  name: string;
  total: number;
  events: PayrollEventResponse[];
}

export interface PayrollEventResponse {
  id: number;
  name: string;
  total: number;
}