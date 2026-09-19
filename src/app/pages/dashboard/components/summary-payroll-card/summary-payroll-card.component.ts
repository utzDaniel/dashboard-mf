import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  inject,
  signal
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { DashboardService } from '../../../../core/services/dashboard.service';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { InputNumberModule } from 'primeng/inputnumber';

import { PayrollSummaryResponse } from '../../../../core/models/dashboard.model';

@Component({
  selector: 'app-summary-payroll-card',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    TagModule,
    InputNumberModule
  ],
  templateUrl: './summary-payroll-card.component.html',
  styleUrl: './summary-payroll-card.component.css'
})
export class SummaryPayrollCardComponent implements OnInit, OnChanges {

  private readonly dashboardService = inject(DashboardService);

  @Input() competenceInitial: string | null = null;
  @Input() competenceEnd: string | null = null;

  payrollSummary = signal<PayrollSummaryResponse | null>(null);

  readonly ENTRY_TYPE = {
    DESCONTO: 1,
    PROVENTO: 2,
    BENEFICIO: 3
  };

  // ============================================================
  // CICLO DE VIDA
  // ============================================================

  ngOnInit(): void {
    this.onSearch();
  }

  ngOnChanges(changes: SimpleChanges): void {

    const initialChanged =
      changes['competenceInitial']?.firstChange === false;

    const endChanged =
      changes['competenceEnd']?.firstChange === false;

    if (initialChanged || endChanged) {
      this.onSearch();
    }
  }

  // ============================================================
  // BUSCAR DADOS
  // ============================================================

  onSearch(): void {

    if (!this.competenceInitial || !this.competenceEnd) {
      return;
    }

    this.dashboardService
      .getPayrollSummary(
        this.competenceInitial,
        this.competenceEnd
      )
      .subscribe({
        next: (response) => {
          this.payrollSummary.set(response);
        },

        error: (error) => {
          console.error(
            'Erro ao buscar resumo da folha:',
            error
          );

          this.payrollSummary.set(null);
        }
      });
  }

  // ============================================================
  // ENTRADAS
  // ============================================================

  getEntry(typeId: number) {

    return this.payrollSummary()?.entry.find(
      entry => entry.id === typeId
    );
  }

  get provento() {
    return this.getEntry(this.ENTRY_TYPE.PROVENTO);
  }

  get desconto() {
    return this.getEntry(this.ENTRY_TYPE.DESCONTO);
  }

  get beneficio() {
    return this.getEntry(this.ENTRY_TYPE.BENEFICIO);
  }

  // ============================================================
  // TOTAIS
  // ============================================================

  /**
   * Total bruto da folha.
   *
   * Proventos + Descontos
   */
  get totalPayroll(): number {

    return (
      (this.provento?.total ?? 0) +
      (this.desconto?.total ?? 0)
    );
  }

  /**
   * Total de proventos.
   */
  get totalProventos(): number {

    return this.provento?.total ?? 0;
  }

  /**
   * Total de descontos.
   */
  get totalDescontos(): number {

    return this.desconto?.total ?? 0;
  }

  /**
   * Total de benefícios.
   */
  get totalBeneficios(): number {

    return this.beneficio?.total ?? 0;
  }

  // ============================================================
  // MÉDIAS MENSAIS
  // ============================================================

  get monthlyPayroll(): number {

    const months = this.getMonths();

    if (!months) {
      return 0;
    }

    return this.totalPayroll / months;
  }

  get monthlyProventos(): number {

    const months = this.getMonths();

    if (!months) {
      return 0;
    }

    return this.totalProventos / months;
  }

  get monthlyDescontos(): number {

    const months = this.getMonths();

    if (!months) {
      return 0;
    }

    return this.totalDescontos / months;
  }

  get monthlyBeneficios(): number {

    const months = this.getMonths();

    if (!months) {
      return 0;
    }

    return this.totalBeneficios / months;
  }

  // ============================================================
  // PERCENTUAIS
  // ============================================================

  /**
   * Percentual dos descontos em relação ao total bruto.
   */
  get discountPercentage(): number {

    if (!this.totalPayroll) {
      return 0;
    }

    return (
      this.totalDescontos /
      this.totalPayroll
    ) * 100;
  }

  /**
   * Percentual dos benefícios em relação ao total bruto.
   */
  get benefitPercentage(): number {

    if (!this.totalPayroll) {
      return 0;
    }

    return (
      this.totalBeneficios /
      this.totalPayroll
    ) * 100;
  }

  /**
   * Retorna o percentual de um determinado valor
   * em relação ao total da folha.
   */
  getEventPercentage(total: number): number {

    if (!this.totalPayroll) {
      return 0;
    }

    return (
      total /
      this.totalPayroll
    ) * 100;
  }

  // ============================================================
  // EVENTOS
  // ============================================================

  get proventoEvents() {

    return this.provento?.events ?? [];
  }

  get descontoEvents() {

    return this.desconto?.events ?? [];
  }

  get beneficioEvents() {

    return this.beneficio?.events ?? [];
  }

  // ============================================================
  // TODOS OS EVENTOS
  // ============================================================

  get allPayrollEvents() {

    return [
      ...this.proventoEvents.map(event => ({
        ...event,
        type: 'Provento'
      })),

      ...this.descontoEvents.map(event => ({
        ...event,
        type: 'Desconto'
      })),

      ...this.beneficioEvents.map(event => ({
        ...event,
        type: 'Benefício'
      }))
    ];
  }

  // ============================================================
  // TOP 5 EVENTOS
  // ============================================================

  get topPayrollEvents() {

    return [...this.allPayrollEvents]
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  }

  // ============================================================
  // QUANTIDADE DE EVENTOS
  // ============================================================

  get totalEvents(): number {

    return (
      this.proventoEvents.length +
      this.descontoEvents.length +
      this.beneficioEvents.length
    );
  }

  // ============================================================
  // MESES DO PERÍODO
  // ============================================================

  private getMonths(): number {

    if (
      !this.competenceInitial ||
      !this.competenceEnd
    ) {
      return 0;
    }

    const initial = this.parseDate(
      this.competenceInitial
    );

    const end = this.parseDate(
      this.competenceEnd
    );

    const months =
      (end.getFullYear() - initial.getFullYear()) * 12 +
      (end.getMonth() - initial.getMonth()) +
      1;

    return Math.max(months, 0);
  }

  // ============================================================
  // DATA
  // ============================================================

  private parseDate(date: string): Date {

    const [year, month, day] = date
      .substring(0, 10)
      .split('-')
      .map(Number);

    return new Date(
      year,
      month - 1,
      day || 1
    );
  }

  formatDate(date: string | null): string {

    if (!date) {
      return '';
    }

    return new Intl.DateTimeFormat('pt-BR', {
      month: '2-digit',
      year: 'numeric'
    }).format(
      this.parseDate(date)
    );
  }

  // ============================================================
  // MOEDA
  // ============================================================

  formatCurrency(
    value: number | null | undefined
  ): string {

    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value ?? 0);
  }

  // ============================================================
  // CORES DOS EVENTOS
  // ============================================================

  getEventColor(type: string): string {

    switch (type) {

      case 'Provento':
        return '#2563eb';

      case 'Desconto':
        return '#ef4444';

      case 'Benefício':
        return '#8b5cf6';

      default:
        return '#64748b';
    }
  }

}
