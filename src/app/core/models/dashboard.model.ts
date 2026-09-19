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

export interface Expense {
  name: string;
  total: number;
}

export interface ExpenseCategory {
  id: number;
  name: string;
  total: number;
  expenses: Expense[];
}

export interface ExpenseSummaryResponse {
  competenceInitial: string;
  competenceEnd: string;
  categories: ExpenseCategory[];
}
