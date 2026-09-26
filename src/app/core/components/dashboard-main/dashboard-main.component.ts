import { Component, Input } from '@angular/core';
import { DashboardEvent } from '../../models/core.model';

@Component({
    selector: 'app-dashboard-main',
    standalone: true,
    templateUrl: './dashboard-main.component.html',
    styleUrl: './dashboard-main.component.css'
})
export class DashboardMainComponent {

    @Input()
    title = 'Registros';

    @Input()
    subtitle = 'Maiores valores';

    @Input()
    events: DashboardEvent[] = [];

    formatCurrency(value: number): string {
        return value.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    }
}
