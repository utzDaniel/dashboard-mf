import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
} from '@angular/core';

import { DashboardItemGroup } from '../../../../models/core.model';

@Component({
  selector: 'app-dashboard-bar-chart',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './dashboard-bar-chart.component.html',
  styleUrl: './dashboard-bar-chart.component.css',
})
export class DashboardBarChartComponent {

  @Input()
  items: DashboardItemGroup[] = [];

  get totalValue(): number {

    return this.items.reduce(
      (total, item) => total + item.value,
      0
    );
  }

  getPercentage(
    item: DashboardItemGroup
  ): number {

    if (!this.totalValue) {
      return 0;
    }

    return (
      item.value /
      this.totalValue
    ) * 100;
  }


  formatValue(
    value: number
  ): string {

    return new Intl.NumberFormat(
      'pt-BR',
      {
        style: 'currency',
        currency: 'BRL',
        maximumFractionDigits: 2,
      }
    ).format(value);
  }
}
