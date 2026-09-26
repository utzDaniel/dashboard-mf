import { Component, Input } from '@angular/core';

import {
  DashboardChartType,
  DashboardItemGroup,
} from '../../models/core.model';

import { DashboardBarChartComponent } from './charts/dashboard-bar-chart/dashboard-bar-chart.component';
import { DashboardColumnChartComponent } from './charts/dashboard-column-chart/dashboard-column-chart.component';
import { DashboardPieChartComponent } from './charts/dashboard-pie-chart/dashboard-pie-chart.component';
import { DashboardLineChartComponent } from './charts/dashboard-line-chart/dashboard-line-chart.component';

@Component({
  selector: 'app-dashboard-overview',
  standalone: true,

  imports: [
    DashboardBarChartComponent,
    DashboardColumnChartComponent,
    DashboardPieChartComponent,
    DashboardLineChartComponent,
  ],

  templateUrl: './dashboard-overview.component.html',
  styleUrl: './dashboard-overview.component.css',
})
export class DashboardOverviewComponent {

  @Input()
  title = 'Visão geral';

  @Input()
  description = 'Distribuições';

  @Input()
  items: DashboardItemGroup[] = [];

  @Input()
  chartType: DashboardChartType = 'bar';

  readonly chartTypes: {
    value: DashboardChartType;
    label: string;
  }[] = [
    {
      value: 'bar',
      label: 'Barras',
    },
    {
      value: 'column',
      label: 'Colunas',
    },
    {
      value: 'pie',
      label: 'Pizza',
    },
    {
      value: 'line',
      label: 'Linha',
    },
  ];

  onChartTypeChange(
    event: Event
  ): void {

    const select =
      event.target as HTMLSelectElement;

    this.chartType =
      select.value as DashboardChartType;
  }
}
