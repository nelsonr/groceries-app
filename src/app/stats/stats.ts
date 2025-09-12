import { Component, computed, inject, signal } from '@angular/core';
import { GroceriesStore } from '../services/groceries-store';
import { GroceryStats } from '../grocery-stats';
import { ProgressCounter } from '../progress-counter/progress-counter';

@Component({
  selector: 'app-stats',
  imports: [ProgressCounter],
  templateUrl: './stats.html',
  styleUrl: './stats.scss',
})
export class Stats {
  protected stats = signal<GroceryStats>({});

  protected statsList = computed(() => {
    return Object.entries(this.stats())
      .map((item) => ({
        name: item[0],
        count: item[1],
      }))
      .toSorted((a, b) => b.count - a.count);
  });

  protected total = computed(() => {
    return Object.entries(this.stats())
      .reduce((acc, val) => acc + val[1], 0);
  });

  private readonly groceriesStore = inject(GroceriesStore);

  ngOnInit() {
    this.stats.set(this.groceriesStore.getStats());
  }
}
