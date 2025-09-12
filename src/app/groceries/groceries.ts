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

@Component({
  selector: 'app-groceries',
  imports: [
    Debounce,
    FormsModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
  ],
  templateUrl: './groceries.html',
  styleUrl: './groceries.scss',
})
export class Groceries {
  protected inputs = viewChildren<ElementRef>('groceryInput');

  protected groceries = signal<Grocery[]>([]);
  protected focusIndex = signal(-1);
  protected checkedCount = computed(() => {
    return this.groceries().filter((item) => item.checked).length;
  });

  private readonly groceriesStore = inject(GroceriesStore);

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
    this.clearCheckedEntries();
  }

  private addEntry(index: number) {
    this.groceries.update((list) => {
      return list.toSpliced(index + 1, 0, {
        id: GroceriesStore.randomId(),
        checked: false,
        text: '',
      });
    });

    this.focusIndex.set(index + 1);
  }

  private updateEntry(updatedEntry: Grocery) {
    const index = this.groceries().findIndex((entry) => entry.id === updatedEntry.id);
    this.groceries.update((list) => list.with(index, updatedEntry));
  }

  private deleteEntry(index: number) {
    if (index > 0) {
      this.focusIndex.set(index - 1);
    } else {
      this.focusIndex.set(0);
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
}
