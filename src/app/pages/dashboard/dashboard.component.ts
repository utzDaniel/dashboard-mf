import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ToastModule } from 'primeng/toast';

import { SearchCardComponent } from './components/search-card/search-card.component';
import { SummaryPayrollCardComponent } from './components/summary-payroll-card/summary-payroll-card.component';
import {
  TabsModule
} from 'primeng/tabs';
import { SummaryExpenseCardComponent } from './components/summary-expense-card/summary-expense-card.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ToastModule,
    TabsModule,
    SearchCardComponent,
    SummaryPayrollCardComponent,
    SummaryExpenseCardComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  competenceInitial: Date | null = null;
  ompetenceEnd: Date | null = null;
  searchCompetenceInitial: string | null = null;
  searchCompetenceEnd: string | null = null;
  updateDay: boolean = false;

  ngOnInit(): void {
    this.competenceInitial = new Date();
    this.ompetenceEnd = new Date();
    this.onSearch();
  }

  onCompetenceInitialSelect(date: Date | null): void {
    if (!date) {
      return;
    }
    this.competenceInitial = date;
  }

  onCompetenceEndSelect(date: Date | null): void {
    if (!date) {
      return;
    }
    this.ompetenceEnd = date;
  }

  onSearch(): void {
    if (!this.competenceInitial || !this.ompetenceEnd) {
      return;
    }
    this.searchCompetenceInitial = this.buildCompetenceDate(this.competenceInitial);
    this.searchCompetenceEnd = this.buildCompetenceDate(this.ompetenceEnd);
  }

  private buildCompetenceDate(date: Date): string {
    const year = date!.getFullYear();
    const month = String(date!.getMonth() + 1).padStart(2, '0');
    const day = this.updateDay ? '01' : '02';
    this.updateDay = !this.updateDay;
    return `${year}-${month}-${day}`;
  }
}
