import {
  Component,
  Input,
} from '@angular/core';
import { DashboardItemGroup } from '../../../../models/core.model';


@Component({
  selector: 'app-dashboard-pie-chart',
  standalone: true,
  templateUrl: './dashboard-pie-chart.component.html',
  styleUrl: './dashboard-pie-chart.component.css',
})
export class DashboardPieChartComponent {

  @Input()
  items: DashboardItemGroup[] = [];

  get total(): number {

    return this.items.reduce(
      (total, item) =>
        total + item.value,
      0
    );
  }

  get pieGradient(): string {

    if (!this.items.length) {
      return '#edf0f5';
    }

    let current = 0;

    const parts = this.items.map(item => {

      const percentage =
        this.total
          ? (item.value / this.total) * 100
          : 0;

      const start = current;

      current += percentage;

      return `${item.color} ${start}% ${current}%`;
    });

    return `conic-gradient(${parts.join(', ')})`;
  }


  getPercentage(
    item: DashboardItemGroup
  ): number {

    if (!this.total) {
      return 0;
    }

    return (
      item.value /
      this.total
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
      }
    ).format(value);
  }

  formatPercentage(value: number): string {
    return new Intl.NumberFormat(
      'pt-BR',
      {
        minimumFractionDigits: 0,
        maximumFractionDigits: 1,
      }
    ).format(value);
  }

}
