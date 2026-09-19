import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  PayrollSummaryResponse,
  ExpenseSummaryResponse
} from '../models/dashboard.model';


@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiDashboardUrl}`;

  getPayrollSummary(
      competenceInitial: string,
      competenceEnd: string,
  ): Observable<PayrollSummaryResponse> {
    return this.http.get<PayrollSummaryResponse>(`${this.baseUrl}/payroll/${competenceInitial}/${competenceEnd}/summary`);
  }

  getExpenseSummary(
      competenceInitial: string,
      competenceEnd: string,
  ): Observable<ExpenseSummaryResponse> {
    return this.http.get<ExpenseSummaryResponse>(`${this.baseUrl}/expense/${competenceInitial}/${competenceEnd}/summary`);
  }

}