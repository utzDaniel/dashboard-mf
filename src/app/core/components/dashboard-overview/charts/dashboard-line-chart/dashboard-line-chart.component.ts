import {
  Component,
  Input,
} from '@angular/core';
import { DashboardItemGroup } from '../../../../models/core.model';

interface LinePoint {
  x: number;
  y: number;
  value: number;
  item: DashboardItemGroup;
}

@Component({
  selector: 'app-dashboard-line-chart',
  standalone: true,
  templateUrl: './dashboard-line-chart.component.html',
  styleUrl: './dashboard-line-chart.component.css',
})
export class DashboardLineChartComponent {

  @Input()
  items: DashboardItemGroup[] = [];


  /**
   * Dimensões internas do SVG.
   *
   * O SVG usa essas dimensões independentemente
   * do tamanho real que ocupará na tela.
   */
  readonly width = 800;

  readonly height = 300;


  /**
   * Espaçamento do gráfico.
   */
  readonly padding = {
    top: 25,
    right: 30,
    bottom: 55,
    left: 55,
  };


  /**
   * Área útil do gráfico.
   */
  get chartWidth(): number {

    return (
      this.width -
      this.padding.left -
      this.padding.right
    );
  }


  get chartHeight(): number {

    return (
      this.height -
      this.padding.top -
      this.padding.bottom
    );
  }


  /**
   * Valor total dos dados.
   */
  get totalValue(): number {

    return this.items.reduce(
      (total, item) => total + item.value,
      0
    );
  }


  /**
   * Valor mínimo.
   *
   * Para dashboard financeiro normalmente
   * começamos o eixo em zero.
   */
  get minValue(): number {

    return 0;
  }


  /**
   * Gera os pontos do gráfico.
   */
  get points(): LinePoint[] {

    if (!this.items.length) {
      return [];
    }

    const max =
      this.totalValue || 1;

    const min =
      this.minValue;

    const range =
      Math.max(max - min, 1);


    return this.items.map(
      (item, index) => {

        const x =
          this.getX(index);

        const normalized =
          (item.value - min) / range;

        const y =
          this.padding.top +
          this.chartHeight -
          normalized * this.chartHeight;

        return {
          x,
          y,
          value: item.value,
          item,
        };

      }
    );
  }


  /**
   * Calcula a posição X de cada ponto.
   */
  private getX(index: number): number {

    if (this.items.length === 1) {

      return (
        this.padding.left +
        this.chartWidth / 2
      );

    }

    return (
      this.padding.left +
      (
        index /
        (this.items.length - 1)
      ) *
      this.chartWidth
    );
  }


  /**
   * Pontos utilizados pelo polyline.
   *
   * Exemplo:
   *
   * 55,200 200,150 350,100
   */
  get linePoints(): string {

    return this.points
      .map(
        point =>
          `${point.x},${point.y}`
      )
      .join(' ');
  }


  /**
   * Pontos utilizados para criar
   * a área preenchida abaixo da linha.
   */
  get areaPoints(): string {

    if (!this.points.length) {
      return '';
    }

    const first =
      this.points[0];

    const last =
      this.points[
        this.points.length - 1
      ];


    const bottom =
      this.padding.top +
      this.chartHeight;


    return [
      `${first.x},${bottom}`,

      ...this.points.map(
        point =>
          `${point.x},${point.y}`
      ),

      `${last.x},${bottom}`,
    ].join(' ');
  }


  /**
   * Linhas horizontais do grid.
   */
  get gridLines(): number[] {

    return [
      0,
      0.25,
      0.5,
      0.75,
      1,
    ];
  }


  /**
   * Calcula a posição Y de uma linha
   * do grid.
   */
  getGridY(
    percentage: number
  ): number {

    return (
      this.padding.top +
      this.chartHeight -
      percentage * this.chartHeight
    );
  }


  /**
   * Valor correspondente a uma posição
   * do grid.
   */
  getGridValue(
    percentage: number
  ): number {

    return (
      this.totalValue *
      percentage
    );
  }


  /**
   * Formatação dos valores.
   */
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


  /**
   * Retorna o primeiro caractere de um
   * nome muito grande.
   */
  getShortName(
    name: string
  ): string {

    if (name.length <= 12) {
      return name;
    }

    return `${name.substring(0, 11)}…`;
  }
}
