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
import { PayrollSummaryResponse } from '../../../../core/models/dashboard.model';

import { InformationFilterComponent } from '../../../../core/components/information-filter/information-filter.component';
import { DashboardItemGroup, DashboardItem, DashboardEvent } from '../../../../core/models/core.model';
import { DashboardOverviewComponent } from '../../../../core/components/dashboard-overview/dashboard-overview.component';
import { DashboardSummaryComponent } from '../../../../core/components/dashboard-summary/dashboard-summary.component';
import { DashboardMainComponent } from '../../../../core/components/dashboard-main/dashboard-main.component';
import { DashboardDetailComponent } from '../../../../core/components/dashboard-detail/dashboard-detail.component';

@Component({
  selector: 'app-summary-payroll-card',
  standalone: true,
  imports: [
    CommonModule,
    InformationFilterComponent,
    DashboardOverviewComponent,
    DashboardSummaryComponent,
    DashboardMainComponent,
    DashboardDetailComponent
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
    LIQUIDO: 2,
    BENEFICIO: 3
  };

  selectedEntryTypes = signal<number[]>([]);

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
          const entryIds = response.entry.map(
            entry => entry.id
          );

          this.selectedEntryTypes.set(entryIds);
        }
      });
  }

  getEntryValue(entryId: number): number {

    const entry =
      this.payrollSummary()?.entry
        .find(entry => entry.id === entryId);

    return !entry ? 0 : entry.total;
  }

  getEntryCount(entryId: number): number {

    const entry =
      this.payrollSummary()?.entry
        .find(entry => entry.id === entryId);

    return !entry ? 0 : entry.events.length;
  }

  getEvents(entryId: number): DashboardItem[] {

    const entry =
      this.payrollSummary()?.entry
        .find(entry => entry.id === entryId)

    return !entry ? [] : entry.events.map(event => ({
      name: event.name,
      value: event.total
    })).sort((a, b) => b.value - a.value);
  }

  get entryTypeOptions(): DashboardItemGroup[] {

    return [
      {
        id: this.ENTRY_TYPE.LIQUIDO,
        name: 'Líquido',
        value: this.getEntryValue(
          this.ENTRY_TYPE.LIQUIDO
        ),
        count: this.getEntryCount(
          this.ENTRY_TYPE.LIQUIDO
        ),
        events: this.getEvents(
          this.ENTRY_TYPE.LIQUIDO
        ),
        icon: 'pi pi-money-bill',
        color: '#16a34a',
        background: '#dcfce7'
      },
      {
        id: this.ENTRY_TYPE.DESCONTO,
        name: 'Desconto',
        value: this.getEntryValue(
          this.ENTRY_TYPE.DESCONTO
        ),
        count: this.getEntryCount(
          this.ENTRY_TYPE.DESCONTO
        ),
        events: this.getEvents(
          this.ENTRY_TYPE.DESCONTO
        ),
        icon: 'pi pi-credit-card',
        color: '#dc2626',
        background: '#fee2e2'
      },
      {
        id: this.ENTRY_TYPE.BENEFICIO,
        name: 'Benefício',
        value: this.getEntryValue(
          this.ENTRY_TYPE.BENEFICIO
        ),
        count: this.getEntryCount(
          this.ENTRY_TYPE.BENEFICIO
        ),
        events: this.getEvents(
          this.ENTRY_TYPE.BENEFICIO
        ),
        icon: 'pi pi-gift',
        color: '#7c3aed',
        background: '#f0e7ff'
      }
    ];
  }

  get entries() {

    const entries =
      this.payrollSummary()?.entry ?? [];

    return entries.filter(entry =>
      this.selectedEntryTypes().includes(entry.id)
    );
  }

  get filteredEntryOptions(): DashboardItemGroup[] {
    return this.entryTypeOptions.filter(item =>
      this.selectedEntryTypes().includes(item.id)
    );
  }

  get filteredEntryEvent(): DashboardEvent[] {

    const entries =
      this.payrollSummary()?.entry ?? [];

    const selectedIds = this.selectedEntryTypes();

    const entryOptions = this.entryTypeOptions;
    return entries
      .filter(entry =>
        selectedIds.includes(entry.id)
      )
      .flatMap(entry => {
        const option =
          entryOptions.find(
            item => item.id === entry.id
          );
        if (!option) {
          return [];
        }
        return entry.events.map(event => ({
          name: event.name,
          type: entry.name,
          value: event.total,
          icon: option.icon,
          color: option.color,
          background: option.background
        }));
      })
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }
}
