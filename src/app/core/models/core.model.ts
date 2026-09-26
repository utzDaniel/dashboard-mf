export interface DashboardEvent {
  name: string;
  type: string;
  value: number;
  icon: string;
  color: string;
  background?: string;
}

export interface DashboardItemGroup {
  id: number;
  name: string;
  icon: string;
  color: string;
  background?: string;
  events: DashboardItem[];
  value: number;
  count: number;
}

export interface DashboardItem {
  name: string;
  value: number;
}


export type DashboardChartType =
  | 'bar'
  | 'column'
  | 'pie'
  | 'line';
