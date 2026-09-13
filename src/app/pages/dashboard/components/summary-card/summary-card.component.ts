import { CommonModule } from '@angular/common';
import { Component, OnInit, Input, OnChanges, SimpleChanges, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DashboardService } from '../../../../core/services/dashboard.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { InputNumberModule } from 'primeng/inputnumber';
import { PayrollSummaryResponse } from '../../../../core/models/dashboard.model';

@Component({
  selector: 'app-summary-card',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule,
    InputTextModule, TagModule, InputNumberModule
  ],
  templateUrl: './summary-card.component.html',
  styleUrl: './summary-card.component.css'
})
export class SummaryCardComponent implements OnInit, OnChanges {

  private readonly dashboardService = inject(DashboardService);


  @Input() competenceInitial: string | null = null;
  @Input() competenceEnd: string | null = null;

  payrollSummary = signal<PayrollSummaryResponse | null>(null);

  readonly ENTRY_TYPE = {
    DESCONTO: 1,
    PROVENTO: 2,
    BENEFICIO: 3
  };

  ngOnInit(): void {
    this.onSearch();
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value ?? 0);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["competenceInitial"]?.firstChange === false || changes["competenceEnd"]?.firstChange === false) {
      this.onSearch();
    }
  }

  onSearch(): void {
    this.dashboardService.getPayrollSummary(this.competenceInitial!, this.competenceEnd!)
      .subscribe({
        next: (response) => {
          this.payrollSummary.set(response);
        }
      });
  }

  getEntry(typeId: number) {
    return this.payrollSummary()?.entry.find(
      entry => entry.id === typeId
    );
  }
}
