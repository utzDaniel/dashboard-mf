import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
  selector: 'app-search-card',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePickerModule],
  templateUrl: './search-card.component.html',
  styleUrl: './search-card.component.css'
})
export class SearchCardComponent {
  selectedCompetenceInitial: Date | undefined = new Date();
  selectedCompetenceEnd: Date | undefined = new Date();

  @Output() readonly selectedCompetenceInitialChange = new EventEmitter<Date | null>();
  @Output() readonly selectedCompetenceEndChange = new EventEmitter<Date | null>();
  @Output() readonly search = new EventEmitter<void>();
}
