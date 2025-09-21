import {
  Component,
  viewChildren,
  effect,
  ElementRef,
  computed,
  inject,
  signal,
} from '@angular/core';
import { Grocery } from '../grocery';
import { Debounce } from '../directives/debounce';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { GroceriesStore } from '../services/groceries-store';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { SuggestionsDialog } from '../suggestions-dialog/suggestions-dialog';

@Component({
  selector: 'app-groceries',
  imports: [
    Debounce,
    FormsModule,
    MatCheckboxModule,
    MatDialogModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    RouterLink,
  ],
  templateUrl: './groceries.html',
  styleUrl: './groceries.scss',
})
export class Groceries {
  protected inputs = viewChildren<ElementRef>('groceryInput');

  protected groceries = signal<Grocery[]>([]);
  protected suggestions = signal<string[]>([])
  protected focusIndex = signal(-1);
  protected checkedCount = computed(() => {
    return this.groceries().filter((item) => item.checked).length;
  });

  private readonly groceriesStore = inject(GroceriesStore);
  private readonly suggestionsDialog = inject(MatDialog);

  constructor() {
    effect(() => {
      this.groceriesStore.storeList(this.groceries());
    });

    effect(() => {
      const index = this.focusIndex();
      const inputs = this.inputs();

      if (inputs[index]) {
        inputs[index].nativeElement.focus();
      }
    });
  }

  ngOnInit() {
    this.groceries.set(this.groceriesStore.getList());
    this.setSugestions();
  }

  protected onKeyDown(ev: KeyboardEvent, index: number) {
    const target = ev.target as HTMLInputElement;
    const isInputEmpty = target.value.length === 0;
    const entriesCount = this.groceries().length;

    if (ev.key === 'Backspace' && isInputEmpty && entriesCount > 1) {
      this.deleteEntry(index);
    }
  }

  protected onKeyUp(ev: KeyboardEvent, index: number) {
    if (ev.key === 'Enter') {
      this.addEntry(index);
    }
  }

  protected onInput(value: string, index: number) {
    const entry = this.groceries().at(index);

    if (entry) {
      entry.text = value;
      this.updateEntry(entry);
    }
  }

  protected onCheckboxChange(ev: MatCheckboxChange, index: number) {
    const entry = this.groceries().at(index);

    if (entry) {
      entry.checked = ev.checked;
      this.updateEntry(entry);
    }
  }

  protected onCleanupClick() {
    this.updateStats();
    this.setSugestions();
    this.clearCheckedEntries();
  }

  protected setFocus(index: number) {
    this.focusIndex.set(index);
  }

  protected openSuggestions(event: Event, index: number) {
    event.stopPropagation();

    const dialogRef = this.suggestionsDialog.open(SuggestionsDialog, {
      width: '90vw',
      height: '60vh',
      data: {
        suggestions: this.suggestions()
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const entry = this.groceries().at(index);

        if (entry) {
          entry.text = result;
          this.updateEntry(entry);
          this.addEntry(index, false);
        }
      }
    });
  }
  private addEntry(index: number, focus = true) {
    this.groceries.update((list) => {
      return list.toSpliced(index + 1, 0, {
        id: GroceriesStore.randomId(),
        checked: false,
        text: '',
      });
    });

    if (focus) {
      this.setFocus(index + 1);
    } else {
      this.setFocus(-1);
    }
  }

  private updateEntry(updatedEntry: Grocery) {
    const index = this.groceries().findIndex((entry) => entry.id === updatedEntry.id);
    this.groceries.update((list) => list.with(index, updatedEntry));
  }

  private deleteEntry(index: number) {
    if (index > 0) {
      this.setFocus(index - 1);
    } else {
      this.setFocus(0);
    }

    this.groceries.update((list) => {
      return list.toSpliced(index, 1);
    });
  }

  private clearCheckedEntries() {
    const remainingEntriesCount = this.groceries().filter((item) => !item.checked).length;

    if (remainingEntriesCount == 0) {
      this.groceries.set(this.groceriesStore.emptyList());
    } else {
      this.groceries.update((list) => list.filter((item) => !item.checked));
    }
  }

  private updateStats() {
    const checkedEntries = this.groceries()
      .filter((item) => item.checked && item.text.trim().length > 0)
      .map((item) => item.text);

    this.groceriesStore.updateStats(checkedEntries);
  }

  private setSugestions() {
    this.suggestions.set(this.groceriesStore.getStatsValues());
  }
}
