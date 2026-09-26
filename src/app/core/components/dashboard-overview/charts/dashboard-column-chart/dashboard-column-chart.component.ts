import {
  Component,
  Input,
} from '@angular/core';
import { DashboardItemGroup } from '../../../../models/core.model';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-dashboard-column-chart',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './dashboard-column-chart.component.html',
  styleUrl: './dashboard-column-chart.component.css',
})
export class DashboardColumnChartComponent {

  @Input()
  items: DashboardItemGroup[] = [];

  get totalValue(): number {

    return this.items.reduce(
      (total, item) => total + item.value,
      0
    );
  }

  getHeight(
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
        maximumFractionDigits: 0,
      }
    ).format(value);
  }
}
