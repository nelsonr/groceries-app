import { Component, effect, inject, signal, WritableSignal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Groceries } from './groceries/groceries';
import { GroceriesStore } from './groceries-store';
import { Grocery } from './grocery';

@Component({
  selector: 'app-root',
  imports: [
    Groceries,
    RouterOutlet,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private readonly _groceriesStore = inject(GroceriesStore);

  protected groceries: WritableSignal<Grocery[]> = signal([]);

  constructor() {
    effect(() => {
      this._groceriesStore.updateList(this.groceries());
    })
  }

  ngOnInit() {
    this.groceries.set(this._groceriesStore.getList());
  }

  protected onAddEntry(index: number) {
    this.groceries.update((list) => {
      return list.toSpliced(index + 1, 0, {
        id: crypto.randomUUID(),
        checked: false,
        text: ""
      });
    });
  }

  protected onUpdateEntry(updatedEntry: Grocery) {
    const index = this.groceries().findIndex((entry) => entry.id === updatedEntry.id);
    this.groceries.update((list) => list.with(index, updatedEntry));
  }

  protected onDeleteEntry(index: number) {
    this.groceries.update((list) => list.toSpliced(index, 1));
  }
}
