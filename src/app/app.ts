import { Component, effect, inject, signal, WritableSignal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Groceries } from './groceries/groceries';
import { GroceriesStore } from './groceries-store';
import { Grocery } from './grocery';

@Component({
  selector: 'app-root',
  imports: [Groceries, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly _groceriesStore = inject(GroceriesStore);

  protected groceries = signal<Grocery[]>([]);
  protected focusIndex = signal(-1);

  constructor() {
    effect(() => {
      this._groceriesStore.updateList(this.groceries());
    });
  }

  ngOnInit() {
    this.groceries.set(this._groceriesStore.getList());
  }

  protected onAddEntry(index: number) {
    this.groceries.update((list) => {
      return list.toSpliced(index + 1, 0, {
        id: GroceriesStore.randomId(),
        checked: false,
        text: '',
      });
    });

    this.focusIndex.set(index + 1);
  }

  protected onUpdateEntry(updatedEntry: Grocery) {
    const index = this.groceries().findIndex((entry) => entry.id === updatedEntry.id);
    this.groceries.update((list) => list.with(index, updatedEntry));
  }

  protected onDeleteEntry(index: number) {
    if (index > 0) {
      this.focusIndex.set(index - 1);
    } else {
      this.focusIndex.set(0);
    }

    this.groceries.update((list) => list.toSpliced(index, 1));
  }

  protected onCleanEntries() {
    this.groceries.update((list) => {
      return list.filter((item) => !item.checked);
    });
  }
}
