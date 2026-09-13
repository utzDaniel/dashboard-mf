import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'dashboard-mf-entry',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet />`,
})
export class EntryComponent {}
