import { Injectable } from '@angular/core';
import { Grocery } from '../grocery';
import { GroceryStats } from '../grocery-stats';

@Injectable({
  providedIn: 'root',
})
export class GroceriesStore {
  public getList(): Grocery[] {
    const data = window.localStorage.getItem('groceries');

    return this.parseData(data);
  }

  public storeList(list: Grocery[]) {
    window.localStorage.setItem('groceries', JSON.stringify(list));
  }

  public getStats(): GroceryStats {
    const data = window.localStorage.getItem('stats');

    return data ? JSON.parse(data) : {};
  }

  public updateStats(entries: string[]) {
    const data = window.localStorage.getItem('stats');
    const stats: GroceryStats = data ? JSON.parse(data) : {};

    for (const entry of entries) {
      if (stats[entry]) {
        stats[entry] = stats[entry] + 1;
      } else {
        stats[entry] = 1;
      }
    }

    this.storeStats(stats);
  }

  public storeStats(stats: GroceryStats) {
    window.localStorage.setItem('stats', JSON.stringify(stats));
  }

  public emptyList() {
    return [
      {
        id: GroceriesStore.randomId(),
        checked: false,
        text: '',
      }
    ];
  }

  public static randomId(): string {
    const numbers = [];

    for (let i = 0; i < 4; i++) {
      const n = Math.ceil(Math.random() * 10000);
      numbers.push(n);
    }

    return numbers.join('-');
  }

  private parseData(data: string | null): Grocery[] {
    if (data) {
      const result = JSON.parse(data);

      if (Array.isArray(result) && result.length > 0) {
        return result as Grocery[];
      }
    }

    return this.emptyList();
  }
}
