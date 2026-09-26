import {
    Component,
    Input
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { DashboardItemGroup } from '../../models/core.model';


@Component({
    selector: 'app-dashboard-detail',
    standalone: true,
    imports: [
        CommonModule
    ],
    templateUrl: './dashboard-detail.component.html',
    styleUrl: './dashboard-detail.component.css'
})
export class DashboardDetailComponent {

    @Input() events: DashboardItemGroup[] = [];

    formatCurrency(
        value: number | null | undefined
    ): string {

        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value ?? 0);
    }
}
