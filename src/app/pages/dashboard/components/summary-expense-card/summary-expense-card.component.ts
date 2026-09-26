import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  inject,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../../../core/services/dashboard.service';
import { ExpenseSummaryResponse } from '../../../../core/models/dashboard.model';

import { InformationFilterComponent } from '../../../../core/components/information-filter/information-filter.component';
import { DashboardItemGroup, DashboardItem, DashboardEvent } from '../../../../core/models/core.model';
import { DashboardOverviewComponent } from '../../../../core/components/dashboard-overview/dashboard-overview.component';
import { DashboardSummaryComponent } from '../../../../core/components/dashboard-summary/dashboard-summary.component';
import { DashboardMainComponent } from '../../../../core/components/dashboard-main/dashboard-main.component';
import { DashboardDetailComponent } from '../../../../core/components/dashboard-detail/dashboard-detail.component';

@Component({
  selector: 'app-summary-expense-card',
  standalone: true,
  imports: [
    CommonModule,
    InformationFilterComponent,
    DashboardOverviewComponent,
    DashboardSummaryComponent,
    DashboardMainComponent,
    DashboardDetailComponent
  ],
  templateUrl: './summary-expense-card.component.html',
  styleUrl: './summary-expense-card.component.css'
})
export class SummaryExpenseCardComponent
  implements OnInit, OnChanges {

  private readonly dashboardService = inject(DashboardService);

  @Input() competenceInitial: string | null = null;
  @Input() competenceEnd: string | null = null;

  expenseSummary = signal<ExpenseSummaryResponse | null>(null);

  readonly EXPENSE_CATEGORY = {
    CUSTO_FIXO: 1,
    CONFORTO: 2,
    PRAZERES: 3,
    CONHECIMENTO: 4,
    EMERGENCIA: 5
  };

  selectedCategories = signal<number[]>([]);


  ngOnInit(): void {
    this.onSearch();
  }

  ngOnChanges(changes: SimpleChanges): void {

    if (
      changes['competenceInitial']?.firstChange === false ||
      changes['competenceEnd']?.firstChange === false
    ) {
      this.onSearch();
    }
  }

  onSearch(): void {

    if (!this.competenceInitial || !this.competenceEnd) {
      return;
    }

    this.dashboardService
      .getExpenseSummary(
        this.competenceInitial,
        this.competenceEnd
      )
      .subscribe({
        next: (response) => {
          this.expenseSummary.set(response);
          const categoryIds = response.categories.map(
            category => category.id
          );

          this.selectedCategories.set(categoryIds);
        }
      });
  }

  getCategoryValue(categoryId: number): number {

    const category =
      this.expenseSummary()?.categories
        .find(category => category.id === categoryId);

    return !category ? 0 : category.total;
  }

  getCategoryCount(categoryId: number): number {

    const category =
      this.expenseSummary()?.categories
        .find(category => category.id === categoryId);

    return !category ? 0 : category.expenses.length;
  }

  getEvents(categoryId: number): DashboardItem[] {

    const category =
      this.expenseSummary()?.categories
        .find(category => category.id === categoryId)

    return !category ? [] : category.expenses.map(expense => ({
      name: expense.name,
      value: expense.total
    })).sort((a, b) => b.value - a.value);
  }

  get categoryOptions(): DashboardItemGroup[] {

    return [
      {
        id: this.EXPENSE_CATEGORY.CUSTO_FIXO,
        name: 'Custo Fixo',
        value: this.getCategoryValue(
          this.EXPENSE_CATEGORY.CUSTO_FIXO
        ),
        count: this.getCategoryCount(
          this.EXPENSE_CATEGORY.CUSTO_FIXO
        ),
        events: this.getEvents(
          this.EXPENSE_CATEGORY.CUSTO_FIXO
        ),
        icon: 'pi pi-home',
        color: '#2563eb',
        background: '#eff6ff'
      },
      {
        id: this.EXPENSE_CATEGORY.CONFORTO,
        name: 'Conforto',
        value: this.getCategoryValue(
          this.EXPENSE_CATEGORY.CONFORTO
        ),
        count: this.getCategoryCount(
          this.EXPENSE_CATEGORY.CONFORTO
        ),
        events: this.getEvents(
          this.EXPENSE_CATEGORY.CONFORTO
        ),
        icon: 'pi pi-heart',
        color: '#8b5cf6',
        background: '#f5f3ff'
      },
      {
        id: this.EXPENSE_CATEGORY.PRAZERES,
        name: 'Prazeres',
        value: this.getCategoryValue(
          this.EXPENSE_CATEGORY.PRAZERES
        ),
        count: this.getCategoryCount(
          this.EXPENSE_CATEGORY.PRAZERES
        ),
        events: this.getEvents(
          this.EXPENSE_CATEGORY.PRAZERES
        ),
        icon: 'pi pi-star',
        color: '#f59e0b',
        background: '#fef2f2'
      },
      {
        id: this.EXPENSE_CATEGORY.CONHECIMENTO,
        name: 'Conhecimento',
        value: this.getCategoryValue(
          this.EXPENSE_CATEGORY.CONHECIMENTO
        ),
        count: this.getCategoryCount(
          this.EXPENSE_CATEGORY.CONHECIMENTO
        ),
        events: this.getEvents(
          this.EXPENSE_CATEGORY.CONHECIMENTO
        ),
        icon: 'pi pi-book',
        color: '#06b6d4',
        background: '#ecfeff'
      },
      {
        id: this.EXPENSE_CATEGORY.EMERGENCIA,
        name: 'Emergência',
        value: this.getCategoryValue(
          this.EXPENSE_CATEGORY.EMERGENCIA
        ),
        count: this.getCategoryCount(
          this.EXPENSE_CATEGORY.EMERGENCIA
        ),
        events: this.getEvents(
          this.EXPENSE_CATEGORY.EMERGENCIA
        ),
        icon: 'pi pi-exclamation-triangle',
        color: '#ef4444',
        background: '#fdf2f8'
      }
    ];
  }

  get categories() {

    const categories =
      this.expenseSummary()?.categories ?? [];

    return categories.filter(category =>
      this.selectedCategories().includes(category.id)
    );
  }

  get filteredCategoryOptions(): DashboardItemGroup[] {
    return this.categoryOptions.filter(item =>
      this.selectedCategories().includes(item.id)
    );
  }

  get filteredCategoryEvent(): DashboardEvent[] {

    const categories =
      this.expenseSummary()?.categories ?? [];

    const selectedIds = this.selectedCategories();

    const categoryOptions = this.categoryOptions;
    return categories
      .filter(category =>
        selectedIds.includes(category.id)
      )
      .flatMap(category => {
        const option =
          categoryOptions.find(
            item => item.id === category.id
          );
        if (!option) {
          return [];
        }
        return category.expenses.map(expense => ({
          name: expense.name,
          type: category.name,
          value: expense.total,
          icon: option.icon,
          color: option.color,
          background: option.background
        }));
      })
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }
}
