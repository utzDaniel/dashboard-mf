import { CommonModule } from '@angular/common';
import { Component, OnInit, Input, OnChanges, SimpleChanges, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DashboardService } from '../../../../core/services/dashboard.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { InputNumberModule } from 'primeng/inputnumber';
import { ExpenseSummaryResponse } from '../../../../core/models/dashboard.model';

@Component({
  selector: 'app-summary-expense-card',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule,
    InputTextModule, TagModule, InputNumberModule
  ],
  templateUrl: './summary-expense-card.component.html',
  styleUrl: './summary-expense-card.component.css'
})
export class SummaryExpenseCardComponent implements OnInit, OnChanges {

  private readonly dashboardService = inject(DashboardService);

  @Input() competenceInitial: string | null = null;
  @Input() competenceEnd: string | null = null;

  expenseSummary = signal<ExpenseSummaryResponse | null>(null);

  readonly EXPENSE_CATEGORY = {
    CUSTO_FIXO: 1,
    CONFORTO: 2,
    METAS: 3,
    PRAZERES: 4,
    INVESTIMENTO: 5,
    CONHECIMENTO: 6,
    EMERGENCIA: 7
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
    this.dashboardService.getExpenseSummary(this.competenceInitial!, this.competenceEnd!)
      .subscribe({
        next: (response) => {
          this.expenseSummary.set(response);
        }
      });
  }

getCategory(expenseId: number) {
    return this.expenseSummary()?.categories.find(
      expense => expense.id === expenseId
    );
  }

  get categories() {
    return this.expenseSummary()?.categories ?? [];
  }
 get totalExpenses(): number {

    return this.categories.reduce(
      (total, category) => total + category.total,
      0
    );
  }
   get totalCategories(): number {
    return this.categories.length;
  }
  get totalExpenseItems(): number {

    return this.categories.reduce(
      (total, category) => total + category.expenses.length,
      0
    );
  }
  get biggestCategory() {

    if (!this.categories.length) {
      return null;
    }

    return [...this.categories]
      .sort((a, b) => b.total - a.total)[0];
  }
  getCategoryPercentage(category: { total: number }): number {

    if (!this.totalExpenses) {
      return 0;
    }

    return (category.total / this.totalExpenses) * 100;
  }
  get allExpenses() {

    return this.categories.flatMap(category =>
      category.expenses.map(expense => ({
        ...expense,
        category: category.name
      }))
    );
  }
  get topExpenses() {

    return [...this.allExpenses]
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  }
  getExpensePercentage(expense: { total: number }): number {

    if (!this.totalExpenses) {
      return 0;
    }

    return (expense.total / this.totalExpenses) * 100;
  }
   getCategoryColor(index: number): string {

    const colors = [
      '#2563eb', // azul
      '#8b5cf6', // roxo
      '#f59e0b', // amarelo
      '#ef4444', // vermelho
      '#10b981', // verde
      '#06b6d4', // cyan
      '#ec4899'  // rosa
    ];

    return colors[index % colors.length];
  }

    formatDate(date: string | null): string {

    if (!date) {
      return '';
    }

    const parsedDate = this.parseDate(date);

    return new Intl.DateTimeFormat('pt-BR', {
      month: '2-digit',
      year: 'numeric'
    }).format(parsedDate);
  }

  private parseDate(date: string): Date {

    const [year, month, day] = date
      .substring(0, 10)
      .split('-')
      .map(Number);

    return new Date(year, month - 1, day || 1);
  }
  get monthlyAverage(): number {

    if (!this.competenceInitial || !this.competenceEnd) {
      return 0;
    }

    const initial = this.parseDate(this.competenceInitial);
    const end = this.parseDate(this.competenceEnd);

    const months =
      (end.getFullYear() - initial.getFullYear()) * 12 +
      (end.getMonth() - initial.getMonth()) + 1;

    if (months <= 0) {
      return 0;
    }

    return this.totalExpenses / months;
  }
}
