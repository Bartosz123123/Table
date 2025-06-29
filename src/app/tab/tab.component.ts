import { Component, OnInit, signal, computed, effect } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';

import { ELEMENT_DATA } from '../DATA';
import { PeriodicElement } from '../app.model';
import { EditDialogComponent } from '../edit-dialog/edit-dialog.component';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-tab',
  standalone: true,
  imports: [
    MatTableModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
  ],
  templateUrl: './tab.component.html',
  styleUrl: './tab.component.scss',
})
export class TabComponent implements OnInit {
  displayedColumns = ['position', 'name', 'weight', 'symbol', 'actions'];

  data = signal<PeriodicElement[]>([]);
  dataSource = signal<typeof ELEMENT_DATA>([]);
  isLoading = signal(true);

  filter = signal('');

  constructor(private dialog: MatDialog) {
    let timer: any;

    effect(() => {
      const filterValue = this.filter();
      clearTimeout(timer);

      timer = setTimeout(() => {
        const normalized = filterValue.trim().toLowerCase();
        const filtered = this.data().filter(
          (el) =>
            el.name.toLowerCase().includes(normalized) ||
            el.symbol.toLowerCase().includes(normalized) ||
            el.position.toString().includes(normalized) ||
            el.weight.toString().includes(normalized)
        );
        this.dataSource.set(filtered);
      }, 2000);
    });
  }

  ngOnInit() {
    setTimeout(() => {
      this.data.set(ELEMENT_DATA);
      this.dataSource.set(ELEMENT_DATA);
      this.isLoading.set(false);
    }, 2000);
  }

  editElement(el: PeriodicElement) {
    this.dialog
      .open(EditDialogComponent, { data: { ...el } })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          const updated = this.data().map((item) =>
            item.position === result.position ? result : item
          );
          this.data.set(updated);

          // odśwież dane z filtrem
          const currentFilter = this.filter();
          const normalized = currentFilter.trim().toLowerCase();
          const filtered = updated.filter(
            (el) =>
              el.name.toLowerCase().includes(normalized) ||
              el.symbol.toLowerCase().includes(normalized) ||
              el.position.toString().includes(normalized) ||
              el.weight.toString().includes(normalized)
          );
          this.dataSource.set(filtered);
        }
      });
  }
}
