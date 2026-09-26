import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardItemGroup } from '../../models/core.model';

@Component({
    selector: 'app-dashboard-summary',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './dashboard-summary.component.html',
    styleUrl: './dashboard-summary.component.css'
})
export class DashboardSummaryComponent {

    @Input() items: DashboardItemGroup[] = [];
    @Input() competenceInitial: string | null = null;
    @Input() competenceEnd: string | null = null;

    get total(): number {
        return this.items.reduce(
            (sum, item) => sum + item.value,
            0
        );
    }

    get totalRecords(): number {
        return this.items.reduce(
            (sum, item) => sum + item.count,
            0
        );
    }

    get average(): number {
        if (!this.totalRecords) {
            return 0;
        }

        return this.total / this.getMonths();
    }

    getMonths(): number {

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

    formatValue(value: number): string {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value || 0);
    }
}