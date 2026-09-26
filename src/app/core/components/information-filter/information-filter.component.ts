import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { DashboardItemGroup } from '../../models/core.model';

@Component({
  selector: 'app-information-filter',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './information-filter.component.html',
  styleUrl: './information-filter.component.css'
})
export class InformationFilterComponent {

  @Input()
  title = 'Filtrar informações';

  @Input()
  description = 'Selecione o que deseja visualizar';

  @Input()
  items: DashboardItemGroup[] = [];

  @Input()
  selectedIds: number[] = [];

  @Output()
  selectedIdsChange =
    new EventEmitter<number[]>();


  // ============================================================
  // SELEÇÃO
  // ============================================================

  isSelected(id: number): boolean {

    return this.selectedIds.includes(id);
  }


  toggle(id: number): void {

    let selected: number[];

    if (this.isSelected(id)) {

      selected = this.selectedIds.filter(
        selectedId => selectedId !== id
      );

    } else {

      selected = [
        ...this.selectedIds,
        id
      ];

    }

    this.emitSelection(selected);
  }


  // ============================================================
  // TODOS / LIMPAR
  // ============================================================

  selectAll(): void {

    const allIds = this.items.map(
      item => item.id
    );

    this.emitSelection(allIds);
  }


  clear(): void {

    this.emitSelection([]);
  }


  // ============================================================
  // ESTADO
  // ============================================================

  get hasSelection(): boolean {

    return this.selectedIds.length > 0;
  }


  get allSelected(): boolean {

    return (
      this.items.length > 0 &&
      this.selectedIds.length === this.items.length
    );
  }


  // ============================================================
  // EVENTO
  // ============================================================

  private emitSelection(
    selected: number[]
  ): void {

    this.selectedIdsChange.emit(selected);
  }

  // ============================================================
  // MOEDA
  // ============================================================

  formatCurrency(
    value: number | null | undefined
  ): string {

    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value ?? 0);
  }
}
