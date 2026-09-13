import { Injectable, inject } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { DashboardService } from '../../../../core/services/dashboard.service';
import { NotificationService } from '../../../../core/services/notification.service';

import {
    PayrollSummaryResponse,
} from '../../../../core/models/dashboard.model';

@Injectable({
    providedIn: 'root'
})
export class DashboardFacade {

    private readonly dashboardService = inject(DashboardService);
    private readonly notification = inject(NotificationService);

    get(
        competenceInitial: string,
        competenceEnd: string,
    ): Observable<PayrollSummaryResponse> {
        return this.dashboardService
            .getPayrollSummary(
                competenceInitial,
                competenceEnd
            )
            .pipe(
                catchError(error => {
                    this.notification.error(
                        error,
                        'Erro ao carregar Folha de Pagamento'
                    );
                    return throwError(() => error);
                })
            );
    }

}
